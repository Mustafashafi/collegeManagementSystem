import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { libraryApi } from '../services/api';
import { Link } from 'react-router-dom';

const LibrarianBooks = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data: books, isLoading } = useQuery({
    queryKey: ['libraryBooks', search, category],
    queryFn: () => libraryApi.getBooks({ search, category }).then(res => Array.isArray(res.data) ? res.data : []),
  });

  const categories = Array.from(new Set(books?.map(b => b.category) || []));

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Book Inventory</h1>
        <Link to="/librarian/books/add" className="btn-primary" style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}>
          <i className="fas fa-plus"></i> Add New Book
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', background: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border)', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: '8px', padding: '0 14px' }}>
          <i className="fas fa-search" style={{ color: 'var(--text-muted)', marginRight: '10px', fontSize: '14px' }}></i>
          <input 
            type="text" 
            placeholder="Search by title, author, or ISBN..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', fontSize: '14px', outline: 'none', fontFamily: 'Inter' }} 
          />
        </div>
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff', outline: 'none', fontSize: '14px', fontFamily: 'Inter', cursor: 'pointer' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="panel" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Book Details</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Category</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>ISBN</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Total</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Available</th>
                 <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}><i className="fas fa-spinner fa-spin"></i> Loading...</td></tr>
              ) : books?.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No books found.</td></tr>
              ) : books?.map((book) => (
                <tr key={book._id}>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <div className="book-info">
                      <h4 style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>{book.title}</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>{book.author}</p>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>{book.category}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>{book.isbn}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>{book.totalCopies}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>{book.availableCopies}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ 
                      fontWeight: 600, fontSize: '11px', 
                      color: book.availableCopies > 0 ? '#10b981' : '#ef4444',
                      background: book.availableCopies > 0 ? '#dcfce7' : '#fee2e2',
                      padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap'
                    }}>
                      {book.availableCopies > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LibrarianBooks;
