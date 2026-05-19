const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const BookRequest = require('../models/BookRequest');
const checkPermission = require('../middleware/permission');

// @route   GET /api/library/stats
router.get('/stats', async (req, res) => {
  try {
    const totalBooks = await Book.aggregate([
      { $group: { _id: null, total: { $sum: "$totalCopies" } } }
    ]);
    const currentlyIssued = await BookRequest.countDocuments({ status: 'Issued' });
    const pendingRequests = await BookRequest.countDocuments({ status: 'Pending' });
    const overdue = await BookRequest.countDocuments({ status: 'Overdue' });

    res.json({
      totalBooks: totalBooks[0]?.total || 0,
      currentlyIssued,
      pendingRequests,
      overdue
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/library/books
router.get('/books', async (req, res) => {
  try {
    const { search = '', category = '' } = req.query;
    const query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }
    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   POST /api/library/books
router.post('/books', checkPermission('Librarian', 'Manage Books'), async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies, location } = req.body;
    const book = new Book({
      title, author, isbn, category,
      totalCopies, availableCopies: totalCopies,
      location
    });
    await book.save();
    res.json({ success: true, book });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/library/requests
router.get('/requests', async (req, res) => {
  try {
    const requests = await BookRequest.find().sort({ requestDate: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   PUT /api/library/requests/:id
router.put('/requests/:id', checkPermission('Librarian', 'Issue Books'), async (req, res) => {
  try {
    const { status, dueDate } = req.body;
    const request = await BookRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    const book = await Book.findById(request.bookId);

    if (status === 'Issued') {
      if (book.availableCopies <= 0) {
        return res.status(400).json({ msg: 'Book currently out of stock' });
      }
      book.availableCopies -= 1;
      if (book.availableCopies === 0) book.status = 'Out of Stock';
      request.issueDate = new Date();
      request.dueDate = dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days default
    }

    if (status === 'Returned') {
      book.availableCopies += 1;
      book.status = 'Available';
      request.returnDate = new Date();
    }

    request.status = status;
    await request.save();
    await book.save();

    // Notify Student
    const { createNotification } = require('../utils/notifier');
    try {
      const userObj = await require('../models/User').findById(request.userId);
      if (userObj && userObj.email) {
        await createNotification({
          recipientEmail: userObj.email,
          title: status === 'Issued' ? 'Book Issued Successfully' : 'Book Returned Successfully',
          message: status === 'Issued'
            ? `The book "${book.title}" has been issued to you! Due date is ${new Date(request.dueDate).toLocaleDateString()}.`
            : `The book "${book.title}" has been successfully returned. Thank you!`,
          type: 'book_request',
          link: '/student/books'
        });
      }
    } catch (notifierErr) {
      console.error('Notifier failed:', notifierErr.message);
    }

    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/library/records
router.get('/records', async (req, res) => {
  try {
    const records = await BookRequest.find({ 
      status: { $in: ['Issued', 'Returned', 'Overdue'] } 
    }).sort({ issueDate: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   POST /api/library/request
router.post('/request', checkPermission('Student', 'Access Library'), async (req, res) => {
  try {
    const { bookId, userId, userName, userRole } = req.body;
    let { studentId } = req.body;

    const user = await require('../models/User').findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Automatically resolve studentId if it's a student
    if (userRole === 'student' && (!studentId || studentId === 'N/A')) {
      const student = await require('../models/Student').findOne({ email: user.email });
      if (student) {
        studentId = student.studentId;
      }
    }
    
    // Check if user already has a pending or issued request for this book
    const existing = await BookRequest.findOne({ 
      bookId, 
      userId, 
      status: { $in: ['Pending', 'Approved', 'Issued'] } 
    });
    
    if (existing) {
      return res.status(400).json({ success: false, msg: 'You already have an active request for this book' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    
    const request = new BookRequest({
      bookId,
      bookTitle: book.title,
      userId,
      userName,
      userRole,
      studentId: studentId || 'N/A',
      status: 'Pending'
    });
    
    await request.save();

    // Notify Librarian
    const { createNotification } = require('../utils/notifier');
    try {
      await createNotification({
        recipientRole: 'librarian',
        title: 'New Book Request',
        message: `${userName} (${userRole}) has requested "${book.title}".`,
        type: 'book_request',
        link: '/librarian/requests'
      });
    } catch (notifierErr) {
      console.error('Notifier failed:', notifierErr.message);
    }

    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/library/my-requests/:userId
router.get('/my-requests/:userId', async (req, res) => {
  try {
    const requests = await BookRequest.find({ userId: req.params.userId }).sort({ requestDate: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/library/profile/:email
// @desc    Get librarian profile by email
router.get('/profile/:email', async (req, res) => {
  try {
    const librarian = await require('../models/User').findOne({ email: req.params.email, role: 'librarian' }).select('-password');
    if (!librarian) return res.status(404).json({ success: false, msg: 'Librarian profile not found' });
    res.json(librarian);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;
