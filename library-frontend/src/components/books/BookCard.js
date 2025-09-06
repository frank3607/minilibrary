 import React, { useState } from "react";
import { FiBookOpen } from "react-icons/fi";
import axios from "axios";

const BookCard = ({ book: initialBook, onBookUpdate }) => {
  const [book, setBook] = useState(initialBook);
  const [loading, setLoading] = useState(false);

  const handleIssue = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to issue a book.");
    try {
      setLoading(true);

      // Optimistic update
      setBook((prev) => ({ ...prev, isUserIssuedBook: true, isUnavailable: false }));

      await axios.put(`/api/books/${book._id}/issue`, {}, { headers: { Authorization: `Bearer ${token}` } });

      onBookUpdate?.();
    } catch (err) {
      console.error("❌ Issue error:", err);
      alert(err.response?.data?.message || "Error issuing book.");
      setBook(initialBook); // revert
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to return a book.");
    try {
      setLoading(true);

      setBook((prev) => ({ ...prev, isUserIssuedBook: false, isUnavailable: false }));

      await axios.put(`/api/books/${book._id}/return`, {}, { headers: { Authorization: `Bearer ${token}` } });

      onBookUpdate?.();
    } catch (err) {
      console.error("❌ Return error:", err);
      alert(err.response?.data?.message || "Error returning book.");
      setBook(initialBook); // revert
    } finally {
      setLoading(false);
    }
  };

  const renderStatusButton = () => {
    if (book.isUserIssuedBook) {
      return (
        <button
          onClick={handleReturn}
          disabled={loading}
          className={`absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow ${
            loading ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {loading ? "Returning..." : "Return"}
        </button>
      );
    }
    if (book.isUnavailable) {
      return (
        <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
          Not Available
        </span>
      );
    }
    return (
      <button
        onClick={handleIssue}
        disabled={loading}
        className={`absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow ${
          loading ? "cursor-not-allowed opacity-70" : ""
        }`}
      >
        {loading ? "Issuing..." : "Issue"}
      </button>
    );
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden relative border ${
        book.isUnavailable ? "border-red-500" : "border-transparent"
      }`}
    >
      {renderStatusButton()}

      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title || "Book cover"} className="h-full w-auto object-cover" />
        ) : (
          <FiBookOpen className="text-gray-400 text-5xl" />
        )}
      </div>

      <div className="p-4">
        <span className="text-xs font-semibold text-indigo-600 uppercase">{book.category}</span>
        <h3 className="mt-1 text-lg font-bold text-gray-800">{book.title}</h3>
        <p className="text-gray-600 text-sm">by {book.author}</p>

        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} role="img" aria-label="star">
              {index < Math.round(book.avgRating || 0) ? "⭐" : "☆"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
