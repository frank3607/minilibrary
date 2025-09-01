 import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("✅ Logged in successfully");
      navigate("/");
    } catch (err) {
      toast.error("❌ Invalid credentials");
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <FiLogIn /> Sign In
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.8)",
            marginBottom: "25px",
          }}
        >
          Access your Racing Books account securely
        </motion.p>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div style={inputContainer}>
            <FiMail style={iconStyle} />
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
            <FiLock style={iconStyle} />
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
            Sign In
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: "18px",
            fontSize: "14px",
            color: "#fff",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#a5d7ff",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Register here
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
