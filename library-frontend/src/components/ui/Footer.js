 import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#121212', color: '#ccc', padding: '3rem 1rem' }} className="footer-fade">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem'
      }}>
        
        {/* Quick Links */}
        <div>
          <h4 style={headingStyle}>Quick Links</h4>
          <ul style={listStyle}>
            <li><Link to="/" style={linkStyle} className="footer-link">Home</Link></li>
            <li><Link to="/books" style={linkStyle} className="footer-link">Books</Link></li>
            <li><Link to="/about" style={linkStyle} className="footer-link">About Us</Link></li>
            <li><Link to="/contact" style={linkStyle} className="footer-link">Contact</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 style={headingStyle}>Account</h4>
          <ul style={listStyle}>
            <li><Link to="/login" style={linkStyle} className="footer-link">Login</Link></li>
            <li><Link to="/register" style={linkStyle} className="footer-link">Register</Link></li>
            <li><Link to="/profile" style={linkStyle} className="footer-link">Profile</Link></li>
            <li><Link to="/dashboard" style={linkStyle} className="footer-link">Dashboard</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 style={headingStyle}>Follow Us</h4>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <a href="https://facebook.com" style={iconLinkStyle} className="footer-icon" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://twitter.com" style={iconLinkStyle} className="footer-icon" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" style={iconLinkStyle} className="footer-icon" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" style={iconLinkStyle} className="footer-icon" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        fontSize: '0.9rem',
        color: '#777',
        borderTop: '1px solid #333',
        paddingTop: '1rem'
      }}>
        © {new Date().getFullYear()} Mini Library. All rights reserved.
      </div>

      {/* Animation Styles */}
      <style>
        {`
          /* Fade-in + slide-up animation */
          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .footer-fade {
            animation: fadeUp 0.8s ease-in-out;
          }

          /* Link hover animation */
          .footer-link {
            transition: all 0.3s ease;
          }
          .footer-link:hover {
            color: #fff;
            transform: translateX(5px);
          }

          /* Social icon hover animation */
          .footer-icon {
            transition: all 0.3s ease;
          }
          .footer-icon:hover {
            background-color: #fff;
            color: #000;
            transform: scale(1.1);
          }
        `}
      </style>
    </footer>
  );
};

/* Styles */
const headingStyle = {
  color: '#fff',
  marginBottom: '1rem',
  fontSize: '1.2rem',
  fontWeight: 'bold'
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  lineHeight: '2'
};

const linkStyle = {
  color: '#ccc',
  textDecoration: 'none'
};

const iconLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#1f1f1f',
  color: '#ccc',
  fontSize: '1.2rem',
  textDecoration: 'none'
};

export default Footer;
