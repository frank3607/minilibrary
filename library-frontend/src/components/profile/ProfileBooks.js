 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBook, FiCalendar, FiClock } from 'react-icons/fi';

const ProfileBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIssuedBooks(res.data.issuedBooks || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchIssuedBooks();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Issued Books</h2>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : issuedBooks.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FiBook className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600">You haven't issued any books yet</p>
          <p className="text-gray-500 mt-2">Browse our collection and issue a book to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {issuedBooks.map((item) => (
            <div key={item.book._id} className="bg-white rounded-xl shadow-md p-6 flex hover:shadow-lg transition">
              <div className="flex-shrink-0 mr-4">
                <img 
                  src={item.book.coverImage} 
                  alt={item.book.title} 
                  className="w-24 h-32 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{item.book.title}</h3>
                <p className="text-gray-600">by {item.book.author}</p>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="mr-2" />
                    <span>Issued: {new Date(item.issueDate).toLocaleDateString()}</span>
                  </div>
                  
                  {item.returnDate ? (
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-2" />
                      <span>Returned: {new Date(item.returnDate).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-green-600">
                      <FiClock className="mr-2" />
                      <span>Currently issued</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <Link 
                    to={`/books/${item.book._id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View Book Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileBooks;