import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BookList from './components/books/BookList';
import BookDetails from './components/books/BookDetails';
import Profile from './components/profile/ProfileHeader';
import AdminDashboard from './components/admin/AdminDashboard';
import UserList from './components/admin/UserList';
import BorrowingHistory from './components/admin/BorrowingHistory';
import AddBook from './components/admin/AddBook';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }) => {
  const { auth } = React.useContext(AuthContext);
  
  if (auth.loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { auth } = React.useContext(AuthContext);
  
  if (auth.loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return auth.user.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <PrivateRoute>
                  <BookList />
                </PrivateRoute>
              } />
              
              <Route path="/books/:id" element={
                <PrivateRoute>
                  <BookDetails />
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              <Route path="/admin/users" element={
                <AdminRoute>
                  <UserList />
                </AdminRoute>
              } />
              
              <Route path="/admin/borrowing-history" element={
                <AdminRoute>
                  <BorrowingHistory />
                </AdminRoute>
              } />
              
              <Route path="/admin/add-book" element={
                <AdminRoute>
                  <AddBook />
                </AdminRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;