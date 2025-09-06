 import axios from "axios";

// Base URL from .env or fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Axios instance
const api = axios.create({ baseURL: API_BASE_URL });

// Attach token if available
const token = localStorage.getItem("token");
if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// ====================
// Public Methods
// ====================

// Get all books
const getBooks = async () => {
  const res = await api.get("/api/books");
  return res.data;
};

// Get single book by ID
const getBookById = async (bookId) => {
  const res = await api.get(`/api/books/${bookId}`);
  return res.data;
};

// ====================
// Authenticated User Methods
// ====================

// Issue a book
const issueBook = async (bookId) => {
  const res = await api.put(`/api/books/${bookId}/issue`);
  return res.data;
};

// Return a book
const returnBook = async (bookId) => {
  const res = await api.put(`/api/books/${bookId}/return`);
  return res.data;
};

// Rate a book
const rateBook = async (bookId, rating) => {
  const res = await api.post(`/api/books/${bookId}/rate`, { rating });
  return res.data;
};

// ====================
// Admin Methods
// ====================

// Add a new book (with image upload)
const addBook = async (formData) => {
  const res = await api.post("/api/books", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Update book details (with image upload)
const updateBook = async (bookId, formData) => {
  const res = await api.put(`/api/books/${bookId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete a book
const deleteBook = async (bookId) => {
  const res = await api.delete(`/api/books/${bookId}`);
  return res.data;
};

export default {
  getBooks,
  getBookById,
  issueBook,
  returnBook,
  rateBook,
  addBook,
  updateBook,
  deleteBook,
};
