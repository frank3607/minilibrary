 // frontend/components/BookList.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BookCard from "./BookCard";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userIssuedBookId, setUserIssuedBookId] = useState(null);

  const categories = [
    "All",
    "F1 Racing",
    "Motorsports",
    "Vintage Cars",
    "Motorbikes",
    "Automotive Engineering",
  ];

  const fetchBooksAndUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 1️⃣ Fetch books
      const booksRes = await axios.get("/api/books", {
        params: {
          search: searchTerm || undefined,
          category: selectedCategory === "All" ? undefined : selectedCategory,
        },
        headers,
      });

      let booksData = Array.isArray(booksRes.data)
        ? booksRes.data
        : Array.isArray(booksRes.data.books)
        ? booksRes.data.books
        : [];

      booksData = booksData.map((book) => ({
        ...book,
        avgRating: Number(book?.avgRating) || 0,
      }));

      setBooks(booksData);

      // 2️⃣ Fetch current user’s issued book (if logged in)
      if (token) {
        const userRes = await axios.get("/api/auth/me", { headers });
        if (userRes.data?.issuedBooks?.length > 0) {
          setUserIssuedBookId(userRes.data.issuedBooks[0]); // Only one issued book allowed
        } else {
          setUserIssuedBookId(null);
        }
      }
    } catch (err) {
      console.error(err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search/filter
  useEffect(() => {
    setLoading(true);
    const delayDebounce = setTimeout(() => {
      fetchBooksAndUser();
    }, 500);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line
  }, [searchTerm, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Automobile & Racing Books
      </h1>

      {/* Search + Category + Button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Optional Search Button */}
        <button
          onClick={fetchBooksAndUser}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </div>

      {/* Book List */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No books found</p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.map((book) => {
            const isUserIssuedBook = userIssuedBookId === book._id;
            const isUnavailable =
              book.isIssued && !isUserIssuedBook; // Issued by someone else

            return (
              <Link
                to={`/books/${book._id}`}
                key={book._id}
                className="hover:scale-105 transition transform"
              >
                <BookCard
                  book={{
                    ...book,
                    isUnavailable,
                    isUserIssuedBook,
                  }}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookList;
