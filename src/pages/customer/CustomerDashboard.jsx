import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";


import banner from "../../assets/banner.jpg";
import searchImg from "../../assets/search.png";
import requestImg from "../../assets/requests.png";
import profileImg from "../../assets/profile.png";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Customer";
const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);

useEffect(() => {
  const interval = setInterval(() => {
    setDarkMode(localStorage.getItem("theme") === "dark");
  }, 200);

  return () => clearInterval(interval);
}, []);


  const [hovered, setHovered] = useState(null);

  return (
    <>
      <Navbar />

      <div
        style={{
          ...styles.page,
          backgroundColor: darkMode ? "#121212" : "#f4f6f8",
          //color: darkMode ? "#fff" : "#000",
        }}
      >
        {/* Banner Section */}
        <div style={styles.bannerContainer}>
          <img src={banner} alt="banner" style={styles.banner} />
          <div style={styles.overlay}></div>
          <div style={styles.bannerText}>
            <h2 style={styles.bannerHeading}>
              Welcome, {name} 👋
            </h2>
              Book trusted professionals easily.
          </div>
        </div>

        {/* Action Cards */}
        <div style={styles.grid}>

          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate("/customer/search");
            }}
            style={{
              ...styles.card,
              backgroundColor: "#ffffffbf",
              transform: hovered === "search" ? "translateY(-6px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHovered("search")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/customer/search")}
          >
          <div style={styles.imageWrapper}>
            <img src={searchImg} alt="search" style={styles.cardImage} />
          </div>
            <h3>Search Services</h3>
            <p>Find skilled workers near you.</p>
          </div>

          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate("/customer/requests");
            }}
            style={{
              ...styles.card,
              backgroundColor: "#ffffffbf",
              transform: hovered === "requests" ? "translateY(-6px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHovered("requests")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/customer/requests")}
          >
          <div style={styles.imageWrapper}>
            <img src={requestImg} alt="requests" style={styles.cardImage} />
          </div>

            <h3>My Requests</h3>
            <p>Track your bookings.</p>
          </div>

          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate("/profile");
            }}
            style={{
              ...styles.card,
              backgroundColor: "#ffffffbf",
              transform: hovered === "profile" ? "translateY(-6px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHovered("profile")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/customer/profile")}
          >
          <div style={styles.imageWrapper}>
            <img src={profileImg} alt="profile" style={styles.cardImage} />
          </div>

            <h3>Profile</h3>
            <p>Update your information.</p>
          </div>

        </div>

      </div>
    </>
  );
};

export default CustomerDashboard;

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    transition: "0.3s",
  },
  bannerContainer: {
    position: "relative",
    marginBottom: "40px",
  },
  banner: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    borderRadius: "12px",
  },
  bannerText: {
    position: "absolute",
    top: "50%",
    left: "5%",
    transform: "translateY(-50%)",
    color: "#fff",
    zIndex: 2,
  },
  

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "30px",
    marginTop: "20px",
  },

  card: {
    padding: "25px 20px",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    textAlign: "center",
  },

  imageWrapper: {
    width: "140px",
    height: "140px",
    overflow: "hidden",
    margin: "0 auto 20px auto",
  },

  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scale(1.25)",  // THIS ZOOMS IMAGE
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    borderRadius: "12px",
  },

  bannerHeading: {
    fontSize: "50px",  //increase size here
    fontWeight: "800",
    letterSpacing: "0.5px",
    marginBottom: "12px",
  },

};
