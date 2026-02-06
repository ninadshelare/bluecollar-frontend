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

  /* ---------- DARK MODE ---------- */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  /* Sync dark mode */
  useEffect(() => {
    const interval = setInterval(() => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    }, 200);
    return () => clearInterval(interval);
  }, []);

  /* ---------- LOAD PROFILE ---------- */
  useEffect(() => {
    getCustomerProfile(userId)
      .then((res) => {
        const p = res.data;

        setForm({
          phone: p.phone || "",
          addressLine1: p.addressLine1 || "",
          addressLine2: p.addressLine2 || "",
          city: p.city || "",
          state: p.state || "",
          pincode: p.pincode || "",
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

  /* ---------- SAVE ---------- */
  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      if (profileExists) {
        await updateCustomerProfile(userId, form);
        alert("Profile updated successfully");
      } else {
        await createCustomerProfile(userId, form);
        alert("Profile created successfully");
        setProfileExists(true);
      }
    } catch {
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async () => {
    if (!window.confirm("Delete your profile permanently?")) return;

    try {
      await deleteCustomerProfile(userId);
      alert("Profile deleted successfully");
      setProfileExists(false);
      setForm(emptyForm);
    } catch {
      alert("Failed to delete profile");
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
              ? "0 20px 40px rgba(0,0,0,0.6)"
              : "0 20px 40px rgba(0,0,0,0.15)",
          }}
        >
          <h2 style={styles.heading}>
            {profileExists ? "Your Profile" : "Complete Your Profile"}
          </h2>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.grid}>
            {Object.keys(form).map((field) => (
              <input
                key={field}
                name={field}
                placeholder={
                  field === "addressLine2"
                    ? "Address Line 2 (Optional)"
                    : field.replace(/([A-Z])/g, " $1")
                }
                value={form[field]}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  background: darkMode ? "#2a2a2a" : "#f9f9f9",
                  color: darkMode ? "#fff" : "#000",
                  border: darkMode
                    ? "1px solid #444"
                    : "1px solid #ddd",
                }}
              />
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={styles.primaryBtn}
          >
            {saving
              ? "Saving..."
              : profileExists
              ? "Update Profile"
              : "Save Profile"}
          </button>

          {profileExists && (
            <button onClick={handleDelete} style={styles.deleteBtn}>
              Delete Profile
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerProfile;

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
    maxWidth: "650px",
    padding: "50px",
    borderRadius: "30px",
    transition: "0.3s",
  },

  heading: {
    fontSize: "28px",
    marginBottom: "40px",
    textAlign: "center",
    fontWeight: "600",
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
};
