 // backend/models/Book.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, required: true, min: 1, max: 5 }
});

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, default: 'General', trim: true },
    description: { type: String, default: '' },
    coverImage: { type: String, default: null },
    isIssued: { type: Boolean, default: false },
    issuedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    issueDate: { type: Date, default: null },
    returnDate: { type: Date, default: null },
    borrowDuration: { type: String, default: null }, // New: store readable duration
    ratings: [ratingSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
