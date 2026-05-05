import React from 'react';

const LibrarianAddBook = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/librarian/books" className="btn-back" style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}>
          <i className="fas fa-arrow-left"></i>
        </a>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Add New Book(s)</h1>
      </div>

      <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', maxWidth: '800px' }}>
        <div className="multi-add-hint" style={{ marginBottom: '15px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-info-circle"></i> Fill details below to add a single book or upload a CSV for bulk entry.
        </div>
        
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div className="form-group full" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Book Title</label>
            <input type="text" className="form-control" placeholder="e.g. Design Patterns: Elements of Reusable Object-Oriented Software" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Author(s)</label>
            <input type="text" className="form-control" placeholder="Erich Gamma, Richard Helm..." style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>ISBN Number</label>
            <input type="text" className="form-control" placeholder="978-0201633610" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Category / Genre</label>
            <select className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
              <option>Computer Science</option>
              <option>Physics</option>
              <option>Mathematics</option>
              <option>Literature</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Publisher</label>
            <input type="text" className="form-control" placeholder="Addison-Wesley" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Publication Year</label>
            <input type="number" className="form-control" placeholder="1994" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Number of Copies</label>
            <input type="number" className="form-control" defaultValue="1" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Location (Shelf/Row)</label>
            <input type="text" className="form-control" placeholder="Shelf A - Row 4" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div className="form-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
          <button className="btn-cancel" onClick={() => window.location.href='/librarian/books'} style={{ padding: '12px 24px', background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>Cancel</button>
          <button className="btn-submit" style={{ padding: '12px 24px', background: 'var(--primary)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#fff' }}>Add to Inventory</button>
        </div>
      </div>
    </div>
  );
};

export default LibrarianAddBook;
