import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../api/axiosInstance";

const SERVICE_MAP = {
  ELECTRICIAN: { workerType: "SKILLED", pricingType: "PER_JOB" },
  PLUMBER: { workerType: "SKILLED", pricingType: "PER_JOB" },
  PAINTER: { workerType: "SKILLED", pricingType: "PER_JOB" },
  CARPENTER: { workerType: "SKILLED", pricingType: "PER_JOB" },
};

const WorkerProfileSetup = () => {
  const userId = localStorage.getItem("userId");

  const [workerId, setWorkerId] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    serviceName: "",
    workerType: "",
    pricingType: "",
    price: "",
    experienceYears: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* ===== PREMIUM DARK MODE (SAME AS DASHBOARD) ===== */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [themeAnimating, setThemeAnimating] = useState(false);

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

  const styles = getStyles(darkMode);

  /* ===== LOAD PROFILE ===== */
  useEffect(() => {
    axiosInstance
      .get(`/api/workers/profile/by-user/${userId}`)
      .then((res) => {
        const data = res.data;
        setWorkerId(data.workerId);
        setProfileExists(true);
        setForm({
          serviceName: data.serviceName || "",
          workerType: data.workerType || "",
          pricingType: data.pricingType || "",
          price: data.price || "",
          experienceYears: data.experienceYears || "",
        });
      })
      .catch(() => setProfileExists(false))
      .finally(() => setLoading(false));
  }, [userId]);

  /* ===== CLOSE DROPDOWN ===== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServiceSelect = (service) => {
    const mapping = SERVICE_MAP[service] || {};
    setForm({
      ...form,
      serviceName: service,
      workerType: mapping.workerType || "",
      pricingType: mapping.pricingType || "",
    });
    setDropdownOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openConfirm = (type) => {
    setConfirmType(type);
    setShowConfirm(true);
  };

  const executeAction = async () => {
    setShowConfirm(false);
    setSaving(true);

    try {
      if (confirmType === "update") {
        await axiosInstance.put(`/api/workers/profile/${workerId}`, form);
        setSuccessMessage("Profile updated successfully!");
      }

      if (confirmType === "delete") {
        await axiosInstance.delete(`/api/workers/profile/${workerId}`);
        setProfileExists(false);
        setWorkerId(null);
        setForm({
          serviceName: "",
          workerType: "",
          pricingType: "",
          price: "",
          experienceYears: "",
        });
        setSuccessMessage("Profile deleted successfully!");
      }

      setShowSuccess(true);
    } catch {
      setError("Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const executeDirectCreate = async () => {
    if (!form.serviceName || !form.price || !form.experienceYears) {
      setError("All fields are required");
      return;
    }

    setSaving(true);

    try {
      const res = await axiosInstance.post(
        "/api/workers/profile",
        form,
        { params: { userId } }
      );

      setWorkerId(res.data.workerId);
      setProfileExists(true);
      setSuccessMessage("Profile created successfully!");
      setShowSuccess(true);
    } catch {
      setError("Failed to create profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 100, textAlign: "center" }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          ...styles.page,
          background: darkMode ? "#121212" : styles.page.background,
          transform: themeAnimating ? "scale(0.98)" : "scale(1)",
          opacity: themeAnimating ? 0.95 : 1,
          transition: "all 0.4s ease",
        }}
      >
        <div style={styles.card}>
          <h2 style={styles.heading}>Worker Profile</h2>

          {error && <p style={styles.error}>{error}</p>}

          <form style={styles.grid}>
            <div style={styles.dropdownWrapper} ref={dropdownRef}>
              <div
                style={styles.dropdownHeader}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {form.serviceName || "Select Service"}
                <span>{dropdownOpen ? "▲" : "▼"}</span>
              </div>

              {dropdownOpen && (
                <div style={styles.dropdownList}>
                  {Object.keys(SERVICE_MAP).map((service) => (
  <div
    key={service}
    style={styles.dropdownItem}
    onClick={() => handleServiceSelect(service)}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = darkMode
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.05)";
      e.currentTarget.style.transform = "translateX(6px) scale(1.02)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.transform = "translateX(0px) scale(1)";
    }}
  >
    {service}
  </div>
))}

                </div>
              )}
            </div>

            <input
              type="number"
              name="experienceYears"
              value={form.experienceYears}
              onChange={handleChange}
              placeholder="Experience (years)"
              style={styles.input}
            />

            {form.workerType && (
              <input
                value={`Worker Type: ${form.workerType}`}
                disabled
                style={styles.input}
              />
            )}

            {form.pricingType && (
              <input
                value={`Pricing Type: ${form.pricingType}`}
                disabled
                style={styles.input}
              />
            )}

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter Price"
              style={styles.input}
            />

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                profileExists ? openConfirm("update") : executeDirectCreate()
              }
              style={styles.primaryBtn}
            >
              {saving
                ? "Processing..."
                : profileExists
                ? "Update Profile"
                : "Create Profile"}
            </button>

            {profileExists && (
              <button
                type="button"
                onClick={() => openConfirm("delete")}
                style={styles.deleteBtn}
              >
                Delete Profile
              </button>
            )}
          </form>
        </div>
      </div>

      {showConfirm && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <div style={styles.iconCircle}>
              {confirmType === "delete" ? "⚠️" : "✏️"}
            </div>
            <h3 style={styles.popupTitle}>
              {confirmType === "delete"
                ? "Delete Profile?"
                : "Update Profile?"}
            </h3>
            <p style={styles.popupText}>
              {confirmType === "delete"
                ? "This action cannot be undone."
                : "Your profile details will be updated."}
            </p>
            <div style={styles.popupActions}>
              <button onClick={executeAction} style={styles.confirmBtn}>
                Yes, Continue
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <div style={styles.successIcon}>✓</div>
            <h3 style={styles.popupTitle}>{successMessage}</h3>
            <button
              onClick={() => setShowSuccess(false)}
              style={{ ...styles.confirmBtn, marginTop: 20 }}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkerProfileSetup;

/* ===== PREMIUM DARK COLORS MATCHING DASHBOARD ===== */
const getStyles = (isDark) => ({
  page: {
    minHeight: "100vh",
    padding: "80px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#e3f2fd,#fce4ec)",
  },

  card: {
    width: "100%",
    maxWidth: "750px",
    padding: "50px",
    borderRadius: "30px",
    background: isDark ? "#1e1e1e" : "#ffffff",
    boxShadow: isDark
      ? "0 25px 60px rgba(0,0,0,0.6)"
      : "0 25px 60px rgba(0,0,0,0.15)",
    color: isDark ? "#ffffff" : "#333",
  },

  heading: {
    fontSize: "30px",
    marginBottom: "40px",
    textAlign: "center",
    fontWeight: "600",
    background: "linear-gradient(135deg,#7b1fa2,#42a5f5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  grid: { display: "grid", gap: "24px" },

  input: {
    padding: "18px",
    borderRadius: "20px",
    border: isDark ? "1px solid #333" : "1px solid #ddd",
    fontSize: "14px",
    background: isDark ? "#2a2a2a" : "#fff",
    color: isDark ? "#fff" : "#333",
  },

  dropdownWrapper: { position: "relative" },

  dropdownHeader: {
    padding: "18px",
    borderRadius: "20px",
    border: isDark ? "1px solid #333" : "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    background: isDark ? "#2a2a2a" : "#f9f9f9",
    color: isDark ? "#fff" : "#333",
  },

  dropdownList: {
    position: "absolute",
    width: "100%",
    marginTop: "10px",
    borderRadius: "20px",
    background: isDark ? "#2a2a2a" : "#ffffff",
    boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
    overflow: "hidden",
    zIndex: 10,
  },

 dropdownItem: {
  padding: "16px",
  cursor: "pointer",
  transition: "all 0.25s ease",
},


  primaryBtn: {
    padding: "16px 25px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(135deg,#7b1fa2,#42a5f5)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "16px 25px",
    borderRadius: "25px",
    border: "none",
    background: "#ef5350",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: { color: "#ff5252", textAlign: "center" },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5000,
  },

  popup: {
    background: isDark ? "#1e1e1e" : "rgba(255,255,255,0.95)",
    padding: "40px",
    borderRadius: "30px",
    width: "360px",
    textAlign: "center",
    boxShadow: "0 25px 70px rgba(0,0,0,0.4)",
    color: isDark ? "#fff" : "#333",
  },

  iconCircle: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#ff6b6b,#ff8e53)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    margin: "0 auto 20px",
    color: "#fff",
  },

  successIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#4caf50,#81c784)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "32px",
    margin: "0 auto 20px",
    color: "#fff",
  },

  popupTitle: { fontSize: "22px", fontWeight: "600", marginBottom: "10px" },
  popupText: { fontSize: "14px", color: isDark ? "#bbb" : "#666", marginBottom: "25px" },
  popupActions: { display: "flex", justifyContent: "center", gap: "15px" },

  confirmBtn: {
    padding: "12px 20px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(135deg,#7b1fa2,#42a5f5)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  cancelBtn: {
    padding: "12px 20px",
    borderRadius: "25px",
    border: isDark ? "1px solid #444" : "1px solid #ddd",
    background: isDark ? "#2a2a2a" : "#fff",
    color: isDark ? "#fff" : "#333",
    fontWeight: "500",
    cursor: "pointer",
  },
});