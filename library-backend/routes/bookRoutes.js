 // backend/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  issueBook,
  returnBook,
  rateBook
} = require('../controllers/bookController');
const { auth, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ====================
// Public Routes
// ====================

// Get all books
router.get('/', getBooks);

// Get single book by ID
router.get('/:id', getBookById);

// ====================
// Admin Routes
// ====================

// Add new book (with image upload)
router.post('/', auth, admin, upload.single('coverImage'), addBook);

// Update book details
router.put('/:id', auth, admin, upload.single('coverImage'), updateBook);

// Delete a book
router.delete('/:id', auth, admin, deleteBook);

// ====================
// Authenticated User Routes
// ====================

// Issue a book
router.put('/:id/issue', auth, issueBook);

// Return a book
router.put('/:id/return', auth, returnBook);

// Rate a book
router.post('/:id/rate', auth, rateBook);

module.exports = router;
