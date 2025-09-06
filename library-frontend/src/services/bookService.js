import api from "./api";

const getBooks = async (params) => {
  const { data } = await api.get("/api/books", { params });
  return data;
};

const getBookById = async (bookId) => {
  const { data } = await api.get(`/api/books/${bookId}`);
  return data;
};

const issueBook = async (bookId) => {
  const { data } = await api.put(`/api/books/${bookId}/issue`);
  return data;
};

const returnBook = async (bookId) => {
  const { data } = await api.put(`/api/books/${bookId}/return`);
  return data;
};

const rateBook = async (bookId, rating) => {
  const { data } = await api.post(`/api/books/${bookId}/rate`, { rating });
  return data;
};

const addBook = async (formData) => {
  const { data } = await api.post(`/api/books`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const updateBook = async (bookId, formData) => {
  const { data } = await api.put(`/api/books/${bookId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const deleteBook = async (bookId) => {
  const { data } = await api.delete(`/api/books/${bookId}`);
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
  deleteBook,
};
