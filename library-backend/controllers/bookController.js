 // backend/controllers/bookController.js
const Book = require("../models/Book");
const User = require("../models/User");
const { logActivity } = require("../utils/activityLogger");
const nodemailer = require("nodemailer");

// 📧 Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📧 Helper function to send email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Library System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
  }
};

// 📚 GET all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate("issuedTo", "name email")
      .lean();

    const updatedBooks = books.map(book => ({
      ...book,
      status: book.isIssued ? "Blocked" : "Available",
    }));

    res.json(updatedBooks);
  } catch (err) {
    console.error("❌ Error fetching books:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 📘 GET single book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("issuedTo", "name email");
    if (!book) return res.status(404).json({ message: "Book not found" });

    let duration = null;
    if (book.issueDate && book.returnDate) {
      const diffMs = new Date(book.returnDate) - new Date(book.issueDate);
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      duration = `${days}d ${hours}h`;
    }

    res.json({ ...book.toObject(), duration });
  } catch (err) {
    console.error("❌ Error fetching book:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 📖 Issue book
const issueBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.isIssued) {
      return res.status(400).json({ message: "Book already issued to another user" });
    }

    const alreadyIssued = await Book.findOne({ issuedTo: req.user.id, isIssued: true });
    if (alreadyIssued) {
      return res.status(400).json({ message: "You already have a book issued. Return it first." });
    }

    book.isIssued = true;
    book.issuedTo = req.user.id;
    book.issueDate = new Date();
    book.returnDate = null;

    await book.save();
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { issuedBooks: book._id } },
      { new: true }
    );

    await logActivity(`📖 Book issued: "${book.title}" to ${req.user.name}`);

    // 📧 Email notification
    await sendEmail(
      user.email,
      `Book Issued: ${book.title}`,
      `Hello ${user.name},\n\nYou have successfully issued the book "${book.title}".\nIssue Date: ${book.issueDate}\nPlease return the book on time.\n\nThank you,\nLibrary Team`
    );

    res.json({ message: "Book issued successfully", book });
  } catch (err) {
    console.error("❌ Error issuing book:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 📦 Return book
const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (!book.isIssued) {
      return res.status(400).json({ message: "Book is not currently issued" });
    }

    if (book.issuedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "You cannot return a book you haven't issued" });
    }

    book.isIssued = false;
    book.returnDate = new Date();
    const userId = book.issuedTo;
    book.issuedTo = null;

    await book.save();
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { issuedBooks: book._id } },
      { new: true }
    );

    await logActivity(`📦 Book returned: "${book.title}" by ${req.user.name}`);

    // Duration calculation
    const diffMs = new Date(book.returnDate) - new Date(book.issueDate);
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

    // 📧 Email notification
    await sendEmail(
      user.email,
      `Book Returned: ${book.title}`,
      `Hello ${user.name},\n\nYou have successfully returned the book "${book.title}".\nYou kept it for: ${days} days and ${hours} hours.\n\nThank you,\nLibrary Team`
    );

    res.json({ message: "Book returned successfully", book });
  } catch (err) {
    console.error("❌ Error returning book:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ⭐ Rate book
const rateBook = async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const existingRating = book.ratings.find(r => r.user.toString() === req.user.id);
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      book.ratings.push({ user: req.user.id, rating });
    }

    await book.save();
    await logActivity(`⭐ Book rated: "${book.title}" → ${rating} stars by ${req.user.name}`);

    res.json({ message: "Book rated successfully", book });
  } catch (err) {
    console.error("❌ Error rating book:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ➕ Add new book (Admin)
const addBook = async (req, res) => {
  try {
    const { title, author, category, description } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: "Title and Author are required" });
    }

    const newBook = new Book({
      title,
      author,
      category,
      description,
      coverImage: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newBook.save();
    await logActivity(`➕ New book added: "${newBook.title}" by ${req.user.name}`);

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (err) {
    console.error("❌ Error adding book:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✏️ Update book (Admin)
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) updates.coverImage = `/uploads/${req.file.filename}`;

    const updatedBook = await Book.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });

    await logActivity(`✏️ Book updated: "${updatedBook.title}" by ${req.user.name}`);

    res.json({ message: "Book updated successfully", book: updatedBook });
  } catch (err) {
    console.error("❌ Error updating book:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🗑️ Delete book (Admin)
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });

    await logActivity(`🗑️ Book deleted: "${deletedBook.title}" by ${req.user.name}`);

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting book:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  issueBook,
  returnBook,
  rateBook,
};
