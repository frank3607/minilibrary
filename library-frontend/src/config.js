 const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://mini-library-backend.onrender.com"  // Replace with your deployed backend URL
    : "http://localhost:5000/api/auth";

export default API_BASE_URL;
