 import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // ✅ fixed path

export default function BookDetails() {
  const { id } = useParams();
  const { auth } = useContext(AuthContext); // ✅ updated to match your AuthContext structure
  const user = auth.user;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch book details
  const fetchBook = async () => {
    try {
      const { data } = await axios.get(`/api/books/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setBook(data);
    } catch (err) {
      console.error("❌ Error fetching book details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Issue Book
  const handleIssueBook = async () => {
    try {
      await axios.put(`/api/books/${book._id}/issue`, {}, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      alert("✅ Book issued successfully");
      fetchBook();
    } catch (err) {
      alert(err.response?.data?.message || "Error issuing book");
    }
  };

  // Return Book
  const handleReturnBook = async () => {
    try {
      await axios.put(`/api/books/${book._id}/return`, {}, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      alert("📦 Book returned successfully");
      fetchBook();
    } catch (err) {
      alert(err.response?.data?.message || "Error returning book");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found</p>;

  const issuedToCurrentUser =
    book.issuedTo && book.issuedTo._id === user?._id;

  return (
    <div className="p-4">
      <Link to="/books" className="text-purple-600 flex items-center mb-4">
        ← Back to Books
      </Link>

      <div className="bg-white rounded-lg shadow p-6 flex">
        {/* Book Cover */}
        <img
          src={book.coverImage || "/default-cover.jpg"}
          alt={book.title}
          className="w-48 h-64 object-cover rounded shadow mr-6"
        />

        {/* Book Info */}
        <div className="flex flex-col flex-1">
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm w-fit mb-2">
            {book.category}
          </span>

          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-600 mb-4">by {book.author}</p>

          {book.isIssued && (
            <p className="mb-4 text-sm text-gray-700">
              📌 Issued to: <strong>{book.issuedTo?.name}</strong> ({book.issuedTo?.email})
            </p>
          )}

          <h2 className="text-lg font-semibold">Description</h2>
          <p className="text-gray-700 mb-4">{book.description}</p>

          {/* Action Buttons */}
          <div>
            {!book.isIssued && (
              <button
                onClick={handleIssueBook}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Issue Book
              </button>
            )}

            {book.isIssued && issuedToCurrentUser && (
              <button
                onClick={handleReturnBook}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Return Book
              </button>
            )}

            {book.isIssued && !issuedToCurrentUser && (
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                disabled
              >
                Not Available
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
