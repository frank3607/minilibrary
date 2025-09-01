 // middleware/validation.js

// Validate book data before adding/updating
exports.validateBook = (req, res, next) => {
  const { title, author, isbn } = req.body;

  // Check required fields
  if (!title || !author || !isbn) {
    return res.status(400).json({ msg: 'Title, author, and ISBN are required' });
  }

  // Optional: Validate ISBN format (basic check for length)
  if (isbn.length < 10 || isbn.length > 13) {
    return res.status(400).json({ msg: 'ISBN should be 10 or 13 characters long' });
  }

  // Everything looks good, move to next middleware/controller
  next();
};
