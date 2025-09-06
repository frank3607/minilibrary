const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const User = require('../models/User');
const Book = require('../models/Book');
const ActivityLog = require('../models/ActivityLog');

// Helper: calculate duration
function calculateDuration(issueDate, returnDate) {
  if (!issueDate) return null;
  const endDate = returnDate ? new Date(returnDate) : new Date();
  const diffMs = endDate - new Date(issueDate);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${minutes}m`;
}

// 📊 Admin Stats
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const borrowedBooks = await Book.countDocuments({ isIssued: true });
    const recentActivity = await ActivityLog.find().sort({ createdAt: -1 }).limit(10).lean();

    res.json({ totalBooks, totalUsers, borrowedBooks, recentActivity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 👥 Get all users
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('issuedBooks', 'title author coverImage');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔒 Block/Unblock User
router.put('/users/:id/block', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;
    const user = await User.findByIdAndUpdate(id, { isBlocked }, { new: true });
    res.json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📚 Borrowing History
router.get('/borrowing-history', auth, admin, async (req, res) => {
  try {
    const history = await Book.find({ $or: [{ issuedTo: { $ne: null } }, { returnDate: { $ne: null } }] })
      .populate('issuedTo', 'name email')
      .select('title author coverImage issuedTo issueDate returnDate isIssued');

    const formatted = history.map(book => ({
      _id: book._id,
      book: { title: book.title, author: book.author, coverImage: book.coverImage },
      user: { name: book.issuedTo?.name || 'Unknown', email: book.issuedTo?.email || '' },
      issueDate: book.issueDate,
      returnDate: book.returnDate,
      status: book.isIssued ? 'Borrowed' : 'Returned',
      duration: calculateDuration(book.issueDate, book.returnDate)
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
