 import api from "./api";

// Get all books
const getBooks = async () => {
  const { data } = await api.get("/api/books");
  return data;
};

// Get single book by ID
const getBookById = async (bookId) => {
  const { data } = await api.get(`/api/books/${bookId}`);
  return data;
};

// Issue a book
const issueBook = async (bookId) => {
  const { data } = await api.put(`/api/books/${bookId}/issue`);
  return data;
};

// Return a book
const returnBook = async (bookId) => {
  const { data } = await api.put(`/api/books/${bookId}/return`);
  return data;
};

// Rate a book
const rateBook = async (bookId, rating) => {
  const { data } = await api.post(`/api/books/${bookId}/rate`, { rating });
  return data;
};

export default { getBooks, getBookById, issueBook, returnBook, rateBook };
