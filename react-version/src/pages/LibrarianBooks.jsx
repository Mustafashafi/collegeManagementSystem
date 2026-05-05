import React from 'react';

const LibrarianBooks = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Book Inventory</h1>
        <button className="btn-primary" style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }} onClick={() => window.location.href = '/librarian/books/add'}>
          <i className="fas fa-plus"></i> Add New Book
        </button>
      </div>

      <div className="filter-bar" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <div className="search-input" style={{ flex: 1, position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
          <input type="text" placeholder="Search by title, author, or ISBN..." style={{ width: '100%', padding: '10px 10px 10px 36px', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff', outline: 'none' }}>
          <option>All Categories</option>
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
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Total Copies</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Available</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                  <div className="book-info">
                    <h4 style={{ fontSize: '12.7px', fontWeight: 600, margin: 0 }}>Introduction to Algorithms</h4>
                    <p style={{ fontSize: '10.7px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>Thomas H. Cormen</p>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12.7px', borderBottom: '1px solid var(--border)' }}>Computer Science</td>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12.7px', borderBottom: '1px solid var(--border)' }}>978-0262033848</td>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12.7px', borderBottom: '1px solid var(--border)' }}>10</td>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12.7px', borderBottom: '1px solid var(--border)' }}>8</td>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12.7px', borderBottom: '1px solid var(--border)' }}>
                  <span className="stock-status in-stock" style={{ fontWeight: 600, fontSize: '12.7px', color: '#10b981' }}>In Stock</span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12.7px', borderBottom: '1px solid var(--border)' }}>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12.7px', borderBottom: 'none' }}>
                  <div className="book-info">
                    <h4 style={{ fontSize: '12.7px', fontWeight: 600, margin: 0 }}>Clean Code</h4>
                    <p style={{ fontSize: '10.7px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>Robert C. Martin</p>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12.7px', borderBottom: 'none' }}>Software Engineering</td>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12.7px', borderBottom: 'none' }}>978-0132350884</td>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12.7px', borderBottom: 'none' }}>5</td>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12.7px', borderBottom: 'none' }}>0</td>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12.7px', borderBottom: 'none' }}>
                  <span className="stock-status out-stock" style={{ fontWeight: 600, fontSize: '12.7px', color: '#ef4444' }}>Out of Stock</span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12.7px', borderBottom: 'none' }}>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LibrarianBooks;
