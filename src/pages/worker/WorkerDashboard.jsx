import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { getWorkerEarnings } from "../../api/workerApi";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [profile, setProfile] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  /* 🔁 THEME SYNC */
  useEffect(() => {
    const interval = setInterval(() => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    }, 200);
    return () => clearInterval(interval);
  }, []);

  /* 👤 LOAD PROFILE */
  useEffect(() => {
    axiosInstance
      .get(`/api/workers/profile/by-user/${userId}`)
      .then((res) => {
        setProfile(res.data);
        localStorage.setItem("workerProfileId", res.data.workerId);

        // 🔥 LOAD EARNINGS
        return getWorkerEarnings(res.data.workerId);
      })
      .then((res) => {
        setEarnings(res.data);
      })
      .catch(() => {
        setProfile(null);
        setEarnings(null);
        localStorage.removeItem("workerProfileId");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          ...styles.wrapper,
          background: darkMode ? "#121212" : "#f4f6f9",
          color: darkMode ? "#fff" : "#000",
        }}
      >
        {/* 🔥 HERO */}
        <div style={styles.hero}>
          <div
            style={{
              ...styles.overlay,
              background: darkMode
                ? "rgba(0,0,0,0.75)"
                : "rgba(0,0,0,0.5)",
            }}
          />
          <div style={styles.heroContent}>
            <div>
              <h1 style={{ fontSize: 36 }}>Welcome Back 👷</h1>
              <p>Track jobs, earnings and performance</p>
            </div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
              alt="worker"
              style={styles.heroImage}
            />
          </div>
        </div>

        {/* 📊 EARNINGS STATS */}
        {earnings && (
          <div style={styles.statsContainer}>
            <StatCard
              title="Total Earnings"
              value={`₹ ${earnings.totalEarnings}`}
              darkMode={darkMode}
            />
            <StatCard
              title="Paid"
              value={`₹ ${earnings.paidEarnings}`}
              darkMode={darkMode}
            />
            <StatCard
              title="Pending"
              value={`₹ ${earnings.pendingEarnings}`}
              darkMode={darkMode}
            />
            <StatCard
              title="Jobs Completed"
              value={earnings.totalJobs}
              darkMode={darkMode}
            />
          </div>
        )}

        {/* 👤 PROFILE */}
        {profile && (
          <div
            style={{
              ...styles.profileCard,
              background: darkMode ? "#1e1e1e" : "#fff",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
              alt="avatar"
              style={styles.avatar}
            />
            <div>
              <h3>{profile.name}</h3>
              <p style={{ opacity: 0.7 }}>{profile.workerType}</p>
            </div>
          </div>
        )}

        {/* 🧩 FEATURES */}
        <div style={styles.cardContainer}>
          <FeatureCard
            title="My Jobs"
            image="https://cdn-icons-png.flaticon.com/512/942/942748.png"
            darkMode={darkMode}
            onClick={() => navigate("/worker/jobs")}
          />

          <FeatureCard
            title="Update Profile"
            image="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
            darkMode={darkMode}
            onClick={() => navigate("/worker/profile")}
          />

          {profile?.workerType === "MAID" && (
            <>
              <FeatureCard
                title="Attendance"
                image="https://cdn-icons-png.flaticon.com/512/747/747310.png"
                darkMode={darkMode}
                onClick={() => navigate("/worker/attendance")}
              />
              <FeatureCard
                title="Salary"
                image="https://cdn-icons-png.flaticon.com/512/2331/2331970.png"
                darkMode={darkMode}
                onClick={() => navigate("/worker/salary")}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkerDashboard;

/* ---------- COMPONENTS ---------- */

const StatCard = ({ title, value, darkMode }) => (
  <div
    style={{
      ...styles.statCard,
      background: darkMode ? "#1e1e1e" : "#fff",
      color: darkMode ? "#fff" : "#000",
    }}
  >
    <p style={{ opacity: 0.7 }}>{title}</p>
    <h2>{value}</h2>
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
    onMouseEnter={(e) =>
      (e.currentTarget.style.transform = "translateY(-8px)")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.transform = "translateY(0px)")
    }
  >
    <img src={image} alt={title} style={styles.cardImage} />
    <h4>{title}</h4>
  </div>
);

/* ---------- STYLES ---------- */

const styles = {
  wrapper: {
    padding: "30px 60px",
    minHeight: "100vh",
    transition: "0.3s",
  },
  hero: {
    position: "relative",
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 40,
    backgroundImage:
      "url('https://images.unsplash.com/photo-1521791136064-7986c2920216')",
    backgroundSize: "cover",
  },
  overlay: {
    position: "absolute",
    inset: 0,
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    color: "#fff",
    padding: "40px 50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroImage: { width: 120 },

  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: 25,
    marginBottom: 40,
  },
  statCard: {
    padding: 22,
    borderRadius: 18,
    textAlign: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  },

  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: 20,
    borderRadius: 18,
    marginBottom: 30,
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  },
  avatar: { width: 70 },

  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: 30,
  },
  card: {
    padding: 30,
    borderRadius: 18,
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    transition: "0.3s",
  },
  cardImage: {
    width: 80,
    marginBottom: 15,
  },
};
