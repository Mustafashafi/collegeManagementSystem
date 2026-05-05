import React from 'react';

const StudentBooks = () => {
  const books = [
    { title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0262033848", available: 8, status: "available" },
    { title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", available: 2, status: "pending" },
    { title: "Modern Physics", author: "Stephen T. Thornton", isbn: "978-1133954132", available: 5, status: "available" },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Library Catalog</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Browse and request books from the central library.</p>
      </div>

      <div className="catalog-search" style={{ width: '100%', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e5e7eb', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="fas fa-search" style={{ color: '#6b7280', fontSize: '14px' }}></i>
          <input type="text" placeholder="Search by title, author, or category..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', color: '#111827' }} />
        </div>
        <select style={{ padding: '0 20px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', fontSize: '13px', fontWeight: 500, background: '#fff', color: '#111827', cursor: 'pointer', minWidth: '160px' }}>
          <option>Computer Science</option>
          <option>Physics</option>
          <option>Mathematics</option>
        </select>
      </div>

      <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {books.map((book, idx) => (
          <div key={idx} className="book-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 className="book-title" style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{book.title}</h3>
              <p className="book-author" style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>{book.author}</p>
              <div className="book-meta" style={{ fontSize: '11px', color: '#6b7280', marginBottom: '15px', display: 'flex', gap: '10px' }}>
                <span>ISBN: {book.isbn}</span>
                <span>Available: {book.available}</span>
              </div>
            </div>
            <button 
              className={`btn-request ${book.status === 'pending' ? 'requested' : ''}`} 
              style={{ 
                width: '100%', 
                padding: '10px', 
                background: book.status === 'pending' ? '#f3f4f6' : '#fff', 
                border: book.status === 'pending' ? '1px solid #e5e7eb' : '1px solid #1a1a1a', 
                color: book.status === 'pending' ? '#6b7280' : '#1a1a1a',
                borderRadius: '8px', 
                fontSize: '13px', 
                fontWeight: 600, 
                cursor: book.status === 'pending' ? 'default' : 'pointer',
                transition: '0.2s'
              }}
            >
              {book.status === 'pending' ? 'Request Pending' : 'Request Book'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentBooks;
