 // backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login a user & get token
 * @access  Public
 */
router.post('/login', loginUser);

/**
 * @route   GET /api/auth/me
 * @desc    Get logged-in user data
 * @access  Private
 */
router.get('/me', auth, getProfile);

module.exports = router;
