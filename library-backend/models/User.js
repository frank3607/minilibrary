const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    mobile: { type: String, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profilePhoto: { type: String, default: null },

    // ✅ Store references to borrowed books
    issuedBooks: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
    ],

    // ✅ Track if user is blocked by admin
    isBlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
