import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { getWorkerEarnings } from "../../api/workerApi";

import workerBanner from "../../assets/workerDashboard/workerBannerPremium.png";
import workerMyJobs from "../../assets/workerDashboard/workerMyJobs.png";
import workerProfileUpdate from "../../assets/workerDashboard/workerProfileUpdate.png";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [profile, setProfile] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);


  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [themeAnimating, setThemeAnimating] = useState(false);

  /* ================= THEME SYNC WITH ANIMATION ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem("theme") === "dark";

      if (currentTheme !== darkMode) {
        setThemeAnimating(true);
        setTimeout(() => setThemeAnimating(false), 400);
      }

      setDarkMode(currentTheme);
    }, 200);

    return () => clearInterval(interval);
  }, [darkMode]);
  useEffect(() => {
  setTimeout(() => setStatsVisible(true), 300);
}, []);

  /* ================= GREETING ================= */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    axiosInstance
      .get(`/api/workers/profile/by-user/${userId}`)
      .then((res) => {
        setProfile(res.data);
        return getWorkerEarnings(res.data.workerId);
      })
      .then((res) => setEarnings(res.data))
      .catch(() => {
        setProfile(null);
        setEarnings(null);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 60, textAlign: "center" }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          ...styles.wrapper,
          background: darkMode ? "#121212" : "#f5f7fb",
          color: darkMode ? "#fff" : "#000",
          transform: themeAnimating ? "scale(0.98)" : "scale(1)",
          opacity: themeAnimating ? 0.95 : 1,
        }}
      >
        {/* ================= HERO ================= */}
        <div
          style={{
            ...styles.hero,
            backgroundImage: `url(${workerBanner})`,
          }}
        >
          <div
            style={{
              ...styles.overlay,
              background: darkMode
                ? "rgba(0,0,0,0.65)"
                : "rgba(0,0,0,0.45)",
            }}
          />

          <div style={styles.heroContent}>
            <div>
              <h2 style={{ fontWeight: 400 }}>{getGreeting()},</h2>
              <h1 style={styles.heroTitle}>
                {profile?.name || "Worker"} 👋
              </h1>
              <p style={{ marginTop: 10 }}>
                Manage your jobs and track earnings easily
              </p>
            </div>
          </div>
        </div>

        {/* ================= STATS ================= */}
        {earnings && (
  <div style={styles.statsGrid}>
    <AnimatedStatCard
      title="Total Earnings"
      value={`₹ ${earnings.totalEarnings}`}
      delay={0}
      darkMode={darkMode}
      visible={statsVisible}
    />
    <AnimatedStatCard
      title="Paid"
      value={`₹ ${earnings.paidEarnings}`}
      delay={150}
      darkMode={darkMode}
      visible={statsVisible}
    />
    <AnimatedStatCard
      title="Pending"
      value={`₹ ${earnings.pendingEarnings}`}
      delay={300}
      darkMode={darkMode}
      visible={statsVisible}
    />
    <AnimatedStatCard
      title="Jobs Completed"
      value={earnings.totalJobs}
      delay={450}
      darkMode={darkMode}
      visible={statsVisible}
    />
  </div>
)}


        {/* ================= FEATURE CARDS ================= */}
        <div style={styles.cardGrid}>
          <FeatureCard
            title="My Jobs"
            image={workerMyJobs}
            onClick={() => navigate("/worker/jobs")}
            darkMode={darkMode}
          />

          <FeatureCard
            title="Update Profile"
            image={workerProfileUpdate}
            onClick={() => navigate("/worker/profile")}
            darkMode={darkMode}
          />
        </div>
      </div>
    </>
  );
};

export default WorkerDashboard;

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, darkMode }) => (
  <div
    style={{
      ...styles.statCard,
      background: darkMode ? "#1e1e1e" : "#fff",
      color: darkMode ? "#fff" : "#000",
    }}
  >
    <p style={{ opacity: 0.7 }}>{title}</p>
    <h2 style={{ marginTop: 8 }}>{value}</h2>
  </div>
);

const FeatureCard = ({ title, image, onClick, darkMode }) => (
  <div
    style={{
      ...styles.card,
      background: darkMode ? "#1e1e1e" : "#fff",
      color: darkMode ? "#fff" : "#000",
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow =
        "0 20px 40px rgba(15, 76, 129, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow =
        "0 10px 25px rgba(0,0,0,0.08)";
    }}
  >
    <div style={styles.imageWrapper}>
      <img src={image} alt={title} style={styles.cardImage} />
    </div>
    <h3 style={{ marginTop: 20 }}>{title}</h3>
  </div>
);


/* ================= STYLES ================= */

const styles = {
  wrapper: {
    padding: "40px 70px",
    minHeight: "100vh",
    transition:
      "background 0.4s ease, color 0.4s ease, transform 0.4s ease, opacity 0.4s ease",
  },

  hero: {
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 50,
    padding: "50px 60px",
    minHeight: 180,
    display: "flex",
    alignItems: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#fff",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    transition: "background 0.4s ease",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
  },

  heroTitle: {
    fontSize: 36,
    fontWeight: 600,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: 25,
    marginBottom: 60,
  },

  statCard: {
    padding: 25,
    borderRadius: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    transition: "background 0.4s ease, color 0.4s ease",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 30,
  },

  card: {
    padding: 35,
    borderRadius: 22,
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    transition:
      "background 0.4s ease, color 0.4s ease, transform 0.3s ease",
  },

  imageWrapper: {
    width: 110,
    height: 110,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
};

const AnimatedStatCard = ({ title, value, delay, darkMode, visible }) => {
  return (
    <div
      style={{
        ...styles.statCard,
        background: darkMode ? "#1e1e1e" : "#fff",
        color: darkMode ? "#fff" : "#000",
        transform: visible ? "translateY(0px)" : "translateY(30px)",
        opacity: visible ? 1 : 0,
        transition: `all 0.6s ease ${delay}ms`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow =
          "0 20px 40px rgba(15, 76, 129, 0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow =
          "0 10px 25px rgba(0,0,0,0.08)";
      }}
    >
      <p style={{ opacity: 0.7 }}>{title}</p>
      <h2 style={{ marginTop: 8 }}>{value}</h2>
    </div>
  );
};

  