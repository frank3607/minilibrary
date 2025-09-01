 import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';

const BorrowingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/borrowing-history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setHistory(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching borrowing history:', err);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/admin" className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4">
          <FiArrowLeft className="mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Borrowing History</h1>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No borrowing history found
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      {/* Book info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.book.coverImage ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={item.book.coverImage}
                              alt={item.book.title}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                              No Img
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.book.title}</div>
                            <div className="text-sm text-gray-500">{item.book.author}</div>
                          </div>
                        </div>
                      </td>

                      {/* User info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.user.name}</div>
                        <div className="text-sm text-gray-500">{item.user.email}</div>
                      </td>

                      {/* Issue Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.issueDate ? new Date(item.issueDate).toLocaleDateString() : '-'}
                      </td>

                      {/* Return Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.returnDate ? new Date(item.returnDate).toLocaleDateString() : 'Not returned'}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'Borrowed'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowingHistory;
