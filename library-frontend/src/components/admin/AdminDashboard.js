 // frontend/src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiBook, FiUsers, FiClock, FiPlusCircle } from "react-icons/fi";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    borrowedBooks: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ["#4F46E5", "#F59E0B"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: "Borrowed Books", value: stats.borrowedBooks },
    { name: "Available Books", value: stats.totalBooks - stats.borrowedBooks }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="bg-indigo-100 p-4 rounded-full mr-4">
                <FiBook className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{stats.totalBooks}</h2>
                <p className="text-gray-600">Total Books</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="bg-green-100 p-4 rounded-full mr-4">
                <FiUsers className="text-green-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="bg-yellow-100 p-4 rounded-full mr-4">
                <FiClock className="text-yellow-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{stats.borrowedBooks}</h2>
                <p className="text-gray-600">Borrowed Books</p>
              </div>
            </div>

            <Link to="/admin/add-book" className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="bg-blue-100 p-4 rounded-full mr-4">
                <FiPlusCircle className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add Book</h2>
                <p className="text-gray-600">New Book</p>
              </div>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <Link to="/admin/users" className="block p-4 bg-gray-50 rounded-lg hover:bg-indigo-50">
                  Manage Users
                </Link>
                <Link to="/admin/borrowing-history" className="block p-4 bg-gray-50 rounded-lg hover:bg-indigo-50">
                  View Borrowing History
                </Link>
                <Link to="/admin/add-book" className="block p-4 bg-gray-50 rounded-lg hover:bg-indigo-50">
                  Add New Book
                </Link>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Books Overview</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="divide-y divide-gray-200">
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => {
                  let icon, bgColor, textColor;

                  if (activity.message.toLowerCase().includes("added")) {
                    icon = <FiPlusCircle className="text-green-600" />;
                    bgColor = "bg-green-100";
                    textColor = "text-green-700";
                  } else if (activity.message.toLowerCase().includes("issued")) {
                    icon = <FiBook className="text-blue-600" />;
                    bgColor = "bg-blue-100";
                    textColor = "text-blue-700";
                  } else if (activity.message.toLowerCase().includes("returned")) {
                    icon = <FiBook className="text-yellow-600" />;
                    bgColor = "bg-yellow-100";
                    textColor = "text-yellow-700";
                  } else if (activity.message.toLowerCase().includes("registered")) {
                    icon = <FiUsers className="text-purple-600" />;
                    bgColor = "bg-purple-100";
                    textColor = "text-purple-700";
                  } else if (activity.message.toLowerCase().includes("logged in")) {
                    icon = <FiClock className="text-gray-600" />;
                    bgColor = "bg-gray-100";
                    textColor = "text-gray-700";
                  } else {
                    icon = <FiClock className="text-gray-600" />;
                    bgColor = "bg-gray-100";
                    textColor = "text-gray-700";
                  }

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-4 hover:bg-gray-50 transition rounded-lg px-2"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${bgColor}`}>
                          {icon}
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">{activity.message}</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}
                      >
                        {activity.message.split(" ")[0]}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 py-4">No recent activity</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
