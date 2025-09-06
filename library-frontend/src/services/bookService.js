 import api from "./api";

const getBooks = async () => {
  const res = await api.get("/api/books");
  return res.data;
};

const getBookById = async (bookId) => {
  const res = await api.get(`/api/books/${bookId}`);
  return res.data;
};

const issueBook = async (bookId) => {
  const res = await api.put(`/api/books/${bookId}/issue`);
  return res.data;
};

const returnBook = async (bookId) => {
  const res = await api.put(`/api/books/${bookId}/return`);
  return res.data;
};

export default {
  getBooks,
  getBookById,
  issueBook,
  returnBook
};
