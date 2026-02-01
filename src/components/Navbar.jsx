import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { logout } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const role = (localStorage.getItem("role") || "CUSTOMER").toUpperCase();

  const username = localStorage.getItem("username") || "User";
  const homeRoutes = {
    ADMIN: "/admin",
    WORKER: "/worker",
   CUSTOMER: "/customer",
  };

  const handleHomeNavigation = () => {
    navigate(homeRoutes[role] || "/customer");
  };
  const initial = username.charAt(0).toUpperCase();

  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#f5f5f5";
  }, [darkMode]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        ...styles.nav,
        background: darkMode ? "#1e1e1e" : "#0d47a1",
      }}
    >
      {/* LEFT */}
      <div style={styles.left} onClick={handleHomeNavigation}>

        <img src={logo} alt="logo" style={styles.logo} />
        <span style={styles.title}>Blue Collar</span>
      </div>

      {/* CENTER LINKS */}
      

      {/* RIGHT */}
      <div style={styles.right}>
        <button onClick={toggleTheme} style={styles.themeBtn}>
          {darkMode ? "☀" : "🌙"}
        </button>

        <div
          style={styles.avatar}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {initial}
        </div>

        {menuOpen && (
          <div style={styles.dropdown}>
            <div style={styles.dropItem}>
              <strong>{username}</strong>
              <div style={{ fontSize: "12px", color: "gray" }}>{role}</div>
            </div>
            <div
              style={styles.dropItem}
              onClick={() => navigate("/profile")}
            >
              Profile
            </div>
            <div style={styles.dropItem} onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 30px",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "0.3s",
    position: "relative",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  logo: {
    width: "40px",
    transition: "0.3s",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "14px",
    transition: "0.3s",
  },
  activeLink: {
    color: "#ffd54f",
    fontWeight: "bold",
    textDecoration: "none",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    position: "relative",
  },
  themeBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  },
  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "#ffca28",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: "50px",
    right: "0",
    background: "#fff",
    color: "#000",
    borderRadius: "6px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
    width: "180px",
    overflow: "hidden",
  },
  dropItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
};
