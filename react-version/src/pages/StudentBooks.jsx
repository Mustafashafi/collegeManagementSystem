import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryApi } from '../services/api';
import toast from 'react-hot-toast';

const StudentBooks = () => {
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem('user'));
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data: books, isLoading: booksLoading } = useQuery({
    queryKey: ['studentBooks', search, category],
    queryFn: () => libraryApi.getBooks({ search, category }).then(res => res.data),
  });

  const { data: myRequests } = useQuery({
    queryKey: ['myRequests', user?.id],
    queryFn: () => libraryApi.getMyRequests(user?.id).then(res => res.data),
    enabled: !!user?.id
  });

  const requestMutation = useMutation({
    mutationFn: (book) => libraryApi.requestBook({
      bookId: book._id,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      studentId: user.studentId || 'N/A'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['studentBooks']);
      queryClient.invalidateQueries(['myRequests']);
      toast.success('Book request submitted!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to submit request');
    }
  });

  const handleRequest = (book) => {
    requestMutation.mutate(book);
  };

  const getBookStatus = (bookId) => {
    const req = myRequests?.find(r => r.bookId === bookId && ['Pending', 'Approved', 'Issued'].includes(r.status));
    return req ? req.status : null;
  };

  const categories = Array.from(new Set(books?.map(b => b.category) || []));

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Library Catalog</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Browse and request books from the central library.</p>
      </div>

      <div className="catalog-search" style={{ width: '100%', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e5e7eb', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="fas fa-search" style={{ color: '#6b7280', fontSize: '14px' }}></i>
          <input 
            type="text" 
            placeholder="Search by title, author, or category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', color: '#111827' }} 
          />
        </div>
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '0 20px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', fontSize: '13px', fontWeight: 500, background: '#fff', color: '#111827', cursor: 'pointer', minWidth: '160px' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {booksLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading catalog...</div>
        ) : books?.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>No books found matching your search.</div>
        ) : books?.map((book) => {
          const status = getBookStatus(book._id);
          return (
            <div key={book._id} className="book-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 className="book-title" style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{book.title}</h3>
                <p className="book-author" style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>{book.author}</p>
                <div className="book-meta" style={{ fontSize: '11px', color: '#6b7280', marginBottom: '15px', display: 'flex', gap: '10px' }}>
                  <span>ISBN: {book.isbn}</span>
                  <span>Available: {book.availableCopies}</span>
                </div>
              </div>
              <button 
                disabled={!!status || book.availableCopies === 0}
                onClick={() => handleRequest(book)}
                className={`btn-request ${status ? 'requested' : ''}`} 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  background: status ? '#f3f4f6' : book.availableCopies === 0 ? '#fee2e2' : '#fff', 
                  border: status ? '1px solid #e5e7eb' : book.availableCopies === 0 ? '1px solid #ef4444' : '1px solid #1a1a1a', 
                  color: status ? '#6b7280' : book.availableCopies === 0 ? '#ef4444' : '#1a1a1a',
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  cursor: (status || book.availableCopies === 0) ? 'default' : 'pointer',
                  transition: '0.2s'
                }}
              >
                {status ? `Request ${status}` : book.availableCopies === 0 ? 'Out of Stock' : 'Request Book'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentBooks;
