 const User = require('../models/User');
const Book = require('../models/Book');

const getAdminStats = async (req, res) => {
  try {
    // Get counts
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const borrowedBooks = await Book.countDocuments({ isIssued: true });

    // Optional: Recent activity placeholder
    const recentActivity = await Book.find({ isIssued: true })
      .populate('issuedTo', 'name')
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title issuedTo updatedAt');

    const activityList = recentActivity.map(b => ({
      message: `Book "${b.title}" issued to ${b.issuedTo ? b.issuedTo.name : 'Unknown User'}`,
      timestamp: b.updatedAt
    }));

    res.json({
      totalBooks,
      totalUsers,
      borrowedBooks,
      recentActivity: activityList
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getAdminStats };
