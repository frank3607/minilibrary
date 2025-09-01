 import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiBook, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect scroll for shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, mobile }) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`relative px-3 py-2 rounded-md text-sm font-medium text-white transition
        after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out after:origin-left
        after:scale-x-0 hover:after:scale-x-100
        ${isActive(to) ? 'bg-indigo-700 after:scale-x-100' : 'hover:bg-gray-800'}
        ${mobile ? 'block w-full text-left' : ''}`}
    >
      {children}
    </Link>
  );

  const menuLinks = [
    { path: '/', label: 'Books' },
    ...(auth.isAuthenticated ? [{ path: '/profile', label: 'My Profile' }] : []),
    ...(auth.isAuthenticated && auth.user?.role === 'admin'
      ? [{ path: '/admin', label: 'Admin Dashboard' }]
      : []),
  ];

  const authLinks = auth.isAuthenticated
    ? []
    : [
        { path: '/login', label: 'Login' },
        { path: '/register', label: 'Register' },
      ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-gray-900 shadow-lg' : 'bg-gray-900'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-90 transition">
            <FiBook className="h-8 w-8 mr-2 text-white" />
            <span className="font-bold text-xl text-white">Racing Books</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuLinks.map((item) => (
              <NavLink key={item.path} to={item.path}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side Auth */}
          <div className="hidden md:flex items-center">
            {auth.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Profile */}
                <div className="flex items-center bg-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-600 transition">
                  {auth.user?.profilePhoto ? (
                    <img
                      src={auth.user.profilePhoto}
                      alt={auth.user.name}
                      className="w-8 h-8 rounded-full mr-2 border border-white"
                    />
                  ) : (
                    <div className="bg-gray-800 border border-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-gray-300 mr-2">
                      <FiUser />
                    </div>
                  )}
                  <span className="text-white">{auth.user?.name}</span>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="flex items-center text-sm font-medium text-white hover:text-gray-300 transition"
                >
                  <FiLogOut className="mr-1" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {authLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-800 transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-2 mt-2 pb-4 border-t border-gray-700">
            {[...menuLinks, ...authLinks].map((item, index) => (
              <div
                key={item.path}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-slideFadeDown"
              >
                <NavLink to={item.path} mobile>
                  {item.label}
                </NavLink>
              </div>
            ))}

            {auth.isAuthenticated && (
              <div
                style={{ animationDelay: `${menuLinks.length * 0.1}s` }}
                className="animate-slideFadeDown"
              >
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-left px-3 py-2 text-sm text-white hover:bg-gray-800 transition w-full"
                >
                  <FiLogOut /> <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
