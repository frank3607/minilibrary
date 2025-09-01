 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser, FiEdit, FiSave } from 'react-icons/fi';

const ProfileHeader = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    profilePhoto: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          mobile: res.data.mobile || '',
          profilePhoto: res.data.profilePhoto || ''
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        Unable to load profile.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-xl shadow-lg p-8 text-white">
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Profile Image */}
        <div className="relative">
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.name || 'User'}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
              <FiUser className="text-white text-4xl" />
            </div>
          )}
          {isEditing && (
            <input
              type="text"
              name="profilePhoto"
              value={formData.profilePhoto}
              onChange={handleChange}
              placeholder="Enter image URL"
              className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded text-gray-900"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-2xl font-bold text-gray-900 px-2 py-1 rounded"
              />
            ) : (
              <h1 className="text-2xl font-bold">{user?.name}</h1>
            )}

            <button
              onClick={() => (isEditing ? handleSubmit() : setIsEditing(true))}
              className="flex items-center bg-white text-indigo-700 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              {isEditing ? <FiSave className="mr-1" /> : <FiEdit className="mr-1" />}
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="space-y-2">
            <p>
              <span className="font-medium">Email:</span> {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="px-2 py-1 rounded text-gray-900"
                />
              ) : (
                user?.email
              )}
            </p>

            <p>
              <span className="font-medium">Mobile:</span> {isEditing ? (
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="px-2 py-1 rounded text-gray-900"
                />
              ) : (
                user?.mobile
              )}
            </p>

            <p>
              <span className="font-medium">Member Since:</span>{' '}
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
