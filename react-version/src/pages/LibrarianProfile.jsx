import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const LibrarianProfile = () => {
  const [librarian, setLibrarian] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/library/profile/${user.email}`);
        const data = await res.json();
        if (res.ok) {
          setLibrarian(data);
        } else {
          toast.error("Failed to load profile.");
        }
      } catch (err) {
        console.error('Error fetching librarian profile:', err);
        toast.error("Error connecting to server.");
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchProfile();
  }, [user.email]);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast.error("Only JPG, JPEG, and PNG images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should not exceed 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('email', user.email);
    formData.append('role', 'librarian');

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile-image`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Profile image updated successfully!");
        setLibrarian(prev => ({ ...prev, profileImage: data.profileImage }));

        // Sync with localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        storedUser.profileImage = data.profileImage;
        localStorage.setItem('user', JSON.stringify(storedUser));

        // Reload after short delay to refresh layout header
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        toast.error(data.msg || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to upload server.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '30px', color: 'var(--primary)' }}></i>
      </div>
    );
  }

  if (!librarian) {
    return (
      <div className="dashboard-content">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h3>Profile not found. Please contact administration.</h3>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'LB';
    const names = name.split(' ');
    if (names.length >= 2) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };
  const initials = getInitials(librarian.name);

  return (
    <div className="dashboard-content">
      <div className="profile-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', maxWidth: '900px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div className="profile-header" style={{ background: '#0f172a', padding: '40px', color: '#fff', display: 'flex', alignItems: 'center', gap: '30px', position: 'relative' }}>
          
          {/* Avatar container with hover upload triggers */}
          <div 
            onClick={handleAvatarClick}
            style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '24px', 
              background: '#fff', 
              color: '#0f172a', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '40px', 
              fontWeight: 800, 
              border: '4px solid rgba(255,255,255,0.2)',
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
            title="Click to update profile image"
          >
            {librarian.profileImage ? (
              <img 
                src={librarian.profileImage.startsWith('http') ? librarian.profileImage : `${API_BASE_URL}${librarian.profileImage}`} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              initials
            )}
            
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: '11px',
              textAlign: 'center',
              padding: '4px 0',
              fontWeight: 600,
              display: uploading ? 'block' : 'none'
            }}>
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            
            <div className="avatar-hover-overlay" style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.2s'
            }}>
              <i className="fas fa-camera" style={{ color: '#fff', fontSize: '20px' }}></i>
            </div>
            
            {/* Inline CSS styling hook for overlay on hover */}
            <style dangerouslySetInnerHTML={{__html: `
              [title="Click to update profile image"]:hover .avatar-hover-overlay {
                opacity: 1 !important;
              }
            `}} />
          </div>

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
            accept=".png, .jpg, .jpeg"
          />

          <div className="profile-title">
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{librarian.name}</h1>
            <p style={{ opacity: 0.8, fontSize: '14px' }}>Library Administrator &bull; Resource Operations</p>
            <div className="status-badge" style={{ marginTop: '12px', display: 'inline-block', padding: '4px 12px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Active</div>
          </div>
        </div>
        
        <div className="profile-body" style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div className="info-section">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-user-circle" style={{ color: '#6366f1' }}></i> Librarian Information
            </h3>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Full Name</span>
              <span className="info-val" style={{ fontWeight: 600 }}>{librarian.name}</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>System Email</span>
              <span className="info-val" style={{ fontWeight: 600 }}>{librarian.email}</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Account Role</span>
              <span className="info-val" style={{ fontWeight: 600, textTransform: 'capitalize' }}>{librarian.role}</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Registered Date</span>
              <span className="info-val" style={{ fontWeight: 600 }}>{new Date(librarian.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="info-section">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-key" style={{ color: '#10b981' }}></i> Privileges & Scope
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#374151' }}>
                <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                <span>Manage Book Inventory Catalog</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#374151' }}>
                <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                <span>Review & Approve Book Issue Requests</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#374151' }}>
                <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                <span>Log Book Return & Circulation History</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#374151' }}>
                <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                <span>Publish Department notices & events</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianProfile;
