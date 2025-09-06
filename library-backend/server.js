 // backend/server.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI missing in .env');
  process.exit(1);
}

const app = express();

// ✅ CORS setup for Vercel + localhost
// ✅ CORS setup for Vercel + localhost
app.use(cors({
  origin: [
    "https://mini-library-tawny.vercel.app", // old frontend URL
    "https://minilibrary-git-main-frank3607s-projects.vercel.app", // ✅ your deployed frontend
    "http://localhost:3000" // local dev
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/books', require('./routes/bookRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes')); // ✅ Admin routes
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
  process.exit(1);
}

// Global error handler (prevents crashes)
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: 'Server error' });
});

// Connect DB and start server
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
})();
