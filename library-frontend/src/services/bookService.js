 // frontend/src/services/bookService.js
import axios from 'axios';

const API_URL = '/api/books';

const getBooks = async (params) => {
  const { data } = await axios.get(API_URL, { params });
  return data;
};

const getBookById = async (bookId, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const { data } = await axios.get(`${API_URL}/${bookId}`, config);
  return data;
};

const issueBook = async (bookId, token) => {
  const { data } = await axios.put(`${API_URL}/${bookId}/issue`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

const returnBook = async (bookId, token) => {
  const { data } = await axios.put(`${API_URL}/${bookId}/return`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

const rateBook = async (bookId, rating, token) => {
  const { data } = await axios.post(`${API_URL}/${bookId}/rate`, { rating }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

// ✅ FIXED: correct path and field name
const addBook = async (formData, token) => {
  const { data } = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

const updateBook = async (bookId, formData, token) => {
  const { data } = await axios.put(`${API_URL}/${bookId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

const deleteBook = async (bookId, token) => {
  const { data } = await axios.delete(`${API_URL}/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export default {
  getBooks,
  getBookById,
  issueBook,
  returnBook,
  rateBook,
  addBook,
  updateBook,
  deleteBook
};
