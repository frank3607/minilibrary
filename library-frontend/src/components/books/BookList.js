 import React, { useState, useEffect, useContext } from "react";
import BookCard from "./BookCard";
import bookService from "../../services/bookService";
import { AuthContext } from "../../context/AuthContext";

const BookList = () => {
  const { auth, updateAuthUser } = useContext(AuthContext);
  const token = auth?.token;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "F1 Racing", "Motorsports", "Vintage Cars", "Motorbikes", "Automotive Engineering"];

  const fetchBooksAndUser = async () => {
    setLoading(true);
    try {
      let booksData = await bookService.getBooks(token);

      if (searchTerm) {
        booksData = booksData.filter((book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedCategory !== "All") {
        booksData = booksData.filter((book) => book.category === selectedCategory);
      }

      booksData = booksData.map((book) => ({
        ...book,
        avgRating: Number(book?.avgRating) || 0,
      }));

      // Determine which books the user has issued
      let userIssuedBooks = auth.user?.issuedBooks || [];
      const updatedBooks = booksData.map((book) => ({
        ...book,
        isUserIssuedBook: userIssuedBooks.includes(book._id),
        isUnavailable: book.isIssued && !userIssuedBooks.includes(book._id),
      }));

      setBooks(updatedBooks);
    } catch (err) {
      console.error("Error fetching books:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBooksAndUser();
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, selectedCategory, auth.user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Automobile & Racing Books</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button
          onClick={fetchBooksAndUser}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No books found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.map((book) => (
            <BookCard key={book._id} book={book} onBookUpdate={fetchBooksAndUser} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
