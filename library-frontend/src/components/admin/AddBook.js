 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookService from '../../services/bookService';
import { FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'F1 Racing',
    description: '',
    coverImage: null
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { title, author, category, description } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onFileChange = e => setFormData({ ...formData, coverImage: e.target.files[0] });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);

      const form = new FormData();
      form.append('title', title);
      form.append('author', author);
      form.append('category', category);
      form.append('description', description);
      if (formData.coverImage) form.append('coverImage', formData.coverImage);

      await bookService.addBook(form, localStorage.getItem('token'));
      toast.success('Book added successfully');
      navigate('/admin/books');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FiPlusCircle className="mr-2 text-indigo-600" /> Add New Book
      </h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Book Title</label>
          <input
            type="text" name="title" value={title} onChange={onChange} required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Enter book title"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Author</label>
          <input
            type="text" name="author" value={author} onChange={onChange} required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Enter author name"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <input
            type="text" name="category" value={category} onChange={onChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="e.g., Motorsports"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            name="description" value={description} onChange={onChange} rows="4"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Enter book description"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Cover Image</label>
          <input type="file" name="coverImage" accept="image/*" onChange={onFileChange} className="w-full" />
        </div>
        <button
          type="submit" disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center"
        >
          {loading ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
