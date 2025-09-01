 import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { name, email, password, mobile } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, mobile }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      setSuccess("✅ Account created successfully. You can now log in.");
      setFormData({ name: "", email: "", password: "", mobile: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const inputContainer = {
    position: "relative",
    marginBottom: "18px",
  };

  const iconStyle = {
    position: "absolute",
    top: "50%",
    left: "14px",
    transform: "translateY(-50%)",
    color: "#bbb",
    fontSize: "16px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 12px 12px 40px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    background: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    backdropFilter: "blur(10px)",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1f1c2c, #928dab)",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "35px 30px",
          width: "100%",
          maxWidth: "420px",
          borderRadius: "15px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          textAlign: "center",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            marginBottom: "8px",
            fontSize: "26px",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Create Account
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.8)",
            marginBottom: "20px",
          }}
        >
          Sign up to get started
        </motion.p>

        {error && (
          <p style={{ color: "#ff6b6b", fontSize: "14px", marginBottom: "10px" }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: "#4CAF50", fontSize: "14px", marginBottom: "10px" }}>
            {success}
          </p>
        )}

        <form onSubmit={onSubmit}>
          <div style={inputContainer}>
            <FaUser style={iconStyle} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={onChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputContainer}>
            <FaEnvelope style={iconStyle} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={onChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputContainer}>
            <FaPhone style={iconStyle} />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={mobile}
              onChange={onChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputContainer}>
            <FaLock style={iconStyle} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={onChange}
              required
              style={inputStyle}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              transition: "background 0.3s ease",
            }}
          >
            Sign Up
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Register;
