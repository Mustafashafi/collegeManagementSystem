import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryApi } from '../services/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const LibrarianAddBook = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    totalCopies: 1,
    location: '',
    publisher: '',
    pubYear: ''
  });

  const addBookMutation = useMutation({
    mutationFn: (data) => libraryApi.addBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['libraryBooks']);
      queryClient.invalidateQueries(['libraryStats']);
      toast.success('Book added successfully!');
      navigate('/librarian/books');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to add book');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addBookMutation.mutate(formData);
  };

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/librarian/books" className="btn-back" style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}>
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Add New Book(s)</h1>
      </div>

      <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div className="form-group full" style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Book Title</label>
              <input 
                type="text" 
                required
                className="form-control" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Design Patterns" 
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Author(s)</label>
              <input 
                type="text" 
                required
                className="form-control" 
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                placeholder="Erich Gamma..." 
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>ISBN Number</label>
              <input 
                type="text" 
                required
                className="form-control" 
                value={formData.isbn}
                onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                placeholder="978-0201633610" 
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Category / Genre</label>
              <select 
                className="form-control" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              >
                <option>Computer Science</option>
                <option>Physics</option>
                <option>Mathematics</option>
                <option>Literature</option>
                <option>Mechanical Engineering</option>
                <option>Business Administration</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Number of Copies</label>
              <input 
                type="number" 
                required
                className="form-control" 
                value={formData.totalCopies}
                onChange={(e) => setFormData({...formData, totalCopies: parseInt(e.target.value)})}
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div className="form-group full" style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Location (Shelf/Row)</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Shelf A - Row 4" 
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
          </div>
          <div className="form-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
            <Link to="/librarian/books" className="btn-cancel" style={{ padding: '12px 24px', background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)', textDecoration: 'none' }}>Cancel</Link>
            <button 
              type="submit" 
              disabled={addBookMutation.isLoading}
              className="btn-submit" 
              style={{ padding: '12px 24px', background: 'var(--primary)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#fff', opacity: addBookMutation.isLoading ? 0.7 : 1 }}
            >
              {addBookMutation.isLoading ? 'Adding...' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibrarianAddBook;
