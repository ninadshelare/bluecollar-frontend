import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/authApi";
import logo from "../assets/logo.png";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- DARK MODE SYNC ---------- */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login({
          email: formData.email,
          password: formData.password,
        });

        // 🔐 STORE AUTH DATA
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("token", res.data.token);

        console.log("JWT Token:", res.data.token);
        console.log("User ID:", res.data.userId);
        console.log("Role:", res.data.role);

        // 🚀 REDIRECT
        if (res.data.role === "ADMIN") navigate("/admin");
        else if (res.data.role === "WORKER") navigate("/worker");
        else navigate("/customer");
      } else {
        await register(formData);
        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...styles.page,
        background: darkMode
          ? "linear-gradient(135deg,#1a1a1a,#121212)"
          : "linear-gradient(135deg,#e3f2fd,#fce4ec)",
      }}
    >
      <div
        style={{
          ...styles.card,
          background: darkMode ? "#1e1e1e" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
          boxShadow: darkMode
            ? "0 25px 50px rgba(0,0,0,0.6)"
            : "0 25px 50px rgba(0,0,0,0.15)",
        }}
      >
        {/* LOGO */}
        <div style={styles.logoContainer}>
          <img src={logo} alt="Blue Collar Logo" style={styles.logo} />
        </div>

        <h2 style={styles.heading}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              style={inputStyle(darkMode)}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={inputStyle(darkMode)}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={inputStyle(darkMode)}
          />

          {!isLogin && (
            <select
              name="role"
              onChange={handleChange}
              style={inputStyle(darkMode)}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="WORKER">Worker</option>
            </select>
          )}

          <button type="submit" disabled={loading} style={styles.primaryBtn}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p style={styles.toggle} onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "New user? Register here"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

/* ---------- INPUT STYLE HELPER ---------- */
const inputStyle = (darkMode) => ({
  ...styles.input,
  background: darkMode ? "#2a2a2a" : "#f9f9f9",
  color: darkMode ? "#fff" : "#000",
  border: darkMode ? "1px solid #444" : "1px solid #ddd",
});

/* ------------------ STYLES ------------------ */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "80px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "50px",
    borderRadius: "30px",
    transition: "0.3s",
    textAlign: "center",
  },

  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },

  logo: {
    width: "90px",
  },

  heading: {
    fontSize: "28px",
    marginBottom: "36px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "18px",
    borderRadius: "20px",
    fontSize: "14px",
    outline: "none",
    marginBottom: "20px",
  },

  primaryBtn: {
    width: "100%",
    padding: "18px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(135deg,#7b1fa2,#42a5f5)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },

  toggle: {
    marginTop: "28px",
    fontSize: "14px",
    color: "#2563eb",
    fontWeight: "500",
    cursor: "pointer",
  },

  error: {
    color: "#ff5252",
    marginBottom: "20px",
    textAlign: "center",
  },
};
