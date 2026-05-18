import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';
import { superAdminApi } from '../services/api';
import toast from 'react-hot-toast';

const SuperAdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Settings State
  const [platformName, setPlatformName] = useState('EduSystem Global ERP');
  const [supportEmail, setSupportEmail] = useState('support@eduglobal.com');
  const [mfaMandatory, setMfaMandatory] = useState(true);
  const [globalApiAccess, setGlobalApiAccess] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await superAdminApi.getSettings();
      if (data.success && data.settings) {
        setPlatformName(data.settings.platformName);
        setSupportEmail(data.settings.supportEmail);
        setMfaMandatory(data.settings.mfaMandatory);
        setGlobalApiAccess(data.settings.globalApiAccess);
        setMaintenanceMode(data.settings.maintenanceMode);
      } else {
        setError('Failed to fetch platform configuration.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      toast.loading('Saving global configurations...', { id: 'saveSettings' });

      const { data } = await superAdminApi.updateSettings({
        platformName,
        supportEmail,
        mfaMandatory,
        globalApiAccess,
        maintenanceMode
      });

      if (data.success) {
        toast.success('Global platform configurations saved successfully!', { id: 'saveSettings' });
      } else {
        toast.error(data.message || 'Failed to save configuration.', { id: 'saveSettings' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error updating global configurations.', { id: 'saveSettings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Global System Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Modify Branding features, global licensing, security controls, and scheduled maintenance locks.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div className="loading-spinner" style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1a1a1a', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : error ? (
        <div className="panel" style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '32px', marginBottom: '12px' }}></i>
          <p style={{ fontWeight: 600 }}>{error}</p>
          <button onClick={fetchSettings} style={{ marginTop: '16px', background: '#1a1a1a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Try Again</button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="settings-card" style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="settings-section" style={{ marginBottom: '30px', borderBottom: '1px solid #f3f4f6', paddingBottom: '30px' }}>
            <h3 className="section-title" style={{ fontSize: '16px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <i className="fas fa-globe" style={{ color: '#3b82f6' }}></i> Branding & Platform
            </h3>
            
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>Platform Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={platformName} 
                onChange={(e) => setPlatformName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
              />
            </div>
            
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>Primary Support Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={supportEmail} 
                onChange={(e) => setSupportEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
              />
            </div>
          </div>
          
          <div className="settings-section" style={{ marginBottom: '30px', borderBottom: '1px solid #f3f4f6', paddingBottom: '30px' }}>
            <h3 className="section-title" style={{ fontSize: '16px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <i className="fas fa-lock" style={{ color: '#22c55e' }}></i> Security & Access
            </h3>
            
            <div className="toggle-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div className="toggle-info">
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Two-Factor Authentication (Mandatory)</h4>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Require MFA validation for all institutional master accounts.</p>
              </div>
              
              {/* Toggle Switch */}
              <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px' }}>
                <input 
                  type="checkbox" 
                  checked={mfaMandatory} 
                  onChange={(e) => setMfaMandatory(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span className="slider" style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: mfaMandatory ? '#22c55e' : '#ccc',
                  borderRadius: '34px',
                  transition: '0.3s'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '16px', width: '16px',
                    left: mfaMandatory ? '21px' : '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: '0.3s'
                  }}></span>
                </span>
              </label>
            </div>
            
            <div className="toggle-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="toggle-info">
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Global API Access</h4>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Enable secure external RESTful integrations across all active clusters.</p>
              </div>
              
              {/* Toggle Switch */}
              <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px' }}>
                <input 
                  type="checkbox" 
                  checked={globalApiAccess} 
                  onChange={(e) => setGlobalApiAccess(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span className="slider" style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: globalApiAccess ? '#22c55e' : '#ccc',
                  borderRadius: '34px',
                  transition: '0.3s'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '16px', width: '16px',
                    left: globalApiAccess ? '21px' : '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: '0.3s'
                  }}></span>
                </span>
              </label>
            </div>
          </div>
          
          <div className="settings-section" style={{ marginBottom: '30px' }}>
            <h3 className="section-title" style={{ fontSize: '16px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <i className="fas fa-database" style={{ color: '#ef4444' }}></i> Maintenance Mode
            </h3>
            
            <div className="toggle-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="toggle-info">
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Global Maintenance Mode</h4>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Lock down all institution portal accounts and display scheduled upgrade messages.</p>
              </div>
              
              {/* Toggle Switch */}
              <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px' }}>
                <input 
                  type="checkbox" 
                  checked={maintenanceMode} 
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span className="slider" style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: maintenanceMode ? '#22c55e' : '#ccc',
                  borderRadius: '34px',
                  transition: '0.3s'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '16px', width: '16px',
                    left: maintenanceMode ? '21px' : '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: '0.3s'
                  }}></span>
                </span>
              </label>
            </div>
          </div>
          
          <div style={{ textAlign: 'right', marginTop: '40px' }}>
            <button 
              type="submit"
              disabled={saving}
              className="btn-primary" 
              style={{
                padding: '12px 24px',
                background: '#1a1a1a',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: '0.2s'
              }}
            >
              {saving ? 'Saving...' : 'Save Global Configuration'}
            </button>
          </div>
        </form>
      )}
    </SuperAdminLayout>
  );
};

export default SuperAdminSettings;
