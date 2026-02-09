import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getCustomerProfile,
  createCustomerProfile,
  updateCustomerProfile,
  deleteCustomerProfile,
} from "../../api/customerApi";

/* ---------- FORM SHAPE ---------- */
const emptyForm = {
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

const CustomerProfile = () => {
  const userId = localStorage.getItem("userId");

  const [profileExists, setProfileExists] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ---------- POPUP STATE ---------- */
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  /* ---------- DARK MODE ---------- */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    }, 200);
    return () => clearInterval(interval);
  }, []);
  const styles = getStyles(darkMode);

  /* ---------- LOAD PROFILE ---------- */
  useEffect(() => {
  getCustomerProfile(userId)
    .then((res) => {
      const data = res.data || {};

      // Only pick allowed fields
      setForm({
        phone: data.phone || "",
        addressLine1: data.addressLine1 || "",
        addressLine2: data.addressLine2 || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
      });

      setProfileExists(true);
    })
    .catch(() => {
      setProfileExists(false);
      setForm(emptyForm);
    })
    .finally(() => setLoading(false));
}, [userId]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  /* ---------- CONFIRM ---------- */
  const validateForm = () => {
  if (
    !form.phone.trim() ||
    !form.addressLine1.trim() ||
    !form.city.trim() ||
    !form.state.trim() ||
    !form.pincode.trim()
  ) {
    setError("Please fill required fields");
    return false;
  }

  return true;
};

  const openConfirm = (type) => {
    setConfirmType(type);
    setShowConfirm(true);
  };

  /* ---------- EXECUTE ACTION ---------- */
  const executeAction = async () => {
    setShowConfirm(false);
    setSaving(true);

    try {
      if (confirmType === "update") {
        if (profileExists) {
          await updateCustomerProfile(userId, form);
          setSuccessMessage("Profile updated successfully!");
        } else {
          await createCustomerProfile(userId, form);
          setProfileExists(true);
          setSuccessMessage("Profile created successfully!");
        }
      }

      if (confirmType === "delete") {
        await deleteCustomerProfile(userId);
        setProfileExists(false);
        setForm(emptyForm);
        setSuccessMessage("Profile deleted successfully!");
      }

      setShowSuccess(true);
    } catch {
      setError("Operation failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.loading}>Loading...</div>
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
  }}
>
        <div style={styles.card}>

          <h2 style={styles.heading}>
            {profileExists ? "Your Profile" : "Complete Your Profile"}
          </h2>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.grid}>
            {Object.keys(form).map((field) => (
              <input
  key={field}
  name={field}
  required={field !== "addressLine2"}
  value={form[field]}
  onChange={handleChange}
  placeholder={
    field === "addressLine2"
      ? "Address Line 2 (Optional)"
      : field.replace(/([A-Z])/g, " $1") + " *"
  }
  style={styles.input}
/>

            ))}
          </div>

          <button
            onClick={() => {
  if (validateForm()) {
    openConfirm("update");
  }
}}

            style={styles.primaryBtn}
            disabled={saving}
          >
            {profileExists ? "Update Profile" : "Save Profile"}
          </button>

          {profileExists && (
            <button
              onClick={() => openConfirm("delete")}
              style={styles.deleteBtn}
            >
              Delete Profile
            </button>
          )}
        </div>
      </div>

      {/* ---------- CONFIRM MODAL ---------- */}
      {showConfirm && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <div style={styles.iconCircle}>
              {confirmType === "delete" ? "⚠️" : "✏️"}
            </div>

            <h3 style={styles.popupTitle}>
              {confirmType === "delete"
                ? "Delete Profile?"
                : "Save Changes?"}
            </h3>

            <p style={styles.popupText}>
              {confirmType === "delete"
                ? "This action cannot be undone."
                : "Your profile details will be saved."}
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

      {/* ---------- SUCCESS MODAL ---------- */}
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

export default CustomerProfile;


/* ------------------ STYLES ------------------ */

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
    maxWidth: "650px",
    padding: "50px",
    borderRadius: "30px",
    boxShadow: isDark
      ? "0 25px 60px rgba(0,0,0,0.6)"
      : "0 25px 60px rgba(0,0,0,0.15)",
    background: isDark ? "#1e1e1e" : "#ffffff",
    color: isDark ? "#ffffff" : "#333",
  },

  heading: {
    fontSize: "28px",
    marginBottom: "40px",
    textAlign: "center",
    fontWeight: "600",
    background: "linear-gradient(135deg,#7b1fa2,#42a5f5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
    gap: "24px",
    marginBottom: "40px",
  },

  input: {
    padding: "18px",
    borderRadius: "20px",
    fontSize: "14px",
    outline: "none",
    border: isDark ? "1px solid #333" : "1px solid #ddd",
    background: isDark ? "#2a2a2a" : "#fff",
    color: isDark ? "#fff" : "#333",
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
    marginBottom: "18px",
  },

  deleteBtn: {
    width: "100%",
    padding: "18px",
    borderRadius: "25px",
    border: "none",
    background: "#ef5350",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
  },

  error: {
    color: "#ff5252",
    marginBottom: "20px",
    textAlign: "center",
  },

  loading: {
    padding: "100px",
    textAlign: "center",
  },

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
    fontWeight: "bold",
  },

  popupTitle: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "10px",
  },

  popupText: {
    fontSize: "14px",
    color: isDark ? "#bbb" : "#666",
    marginBottom: "25px",
  },

  popupActions: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },

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