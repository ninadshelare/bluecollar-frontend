import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getCustomerProfile,
  createCustomerProfile,
  updateCustomerProfile,
  deleteCustomerProfile,
} from "../../api/customerApi";

const CustomerProfile = () => {
  const userId = localStorage.getItem("userId");

  const [profileExists, setProfileExists] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCustomerProfile(userId)
      .then((res) => {
        setForm(res.data);
        setProfileExists(true);
      })
      .catch(() => {
        setProfileExists(false);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;

    try {
      await deleteCustomerProfile(userId);
      alert("Profile deleted");
      setProfileExists(false);
      setForm({
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch {
      alert("Failed to delete profile");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>{profileExists ? "Your Profile" : "Complete Profile"}</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          name="addressLine1"
          placeholder="Address Line 1"
          value={form.addressLine1}
          onChange={handleChange}
        />

        <input
          name="addressLine2"
          placeholder="Address Line 2"
          value={form.addressLine2}
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
        />

        <input
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
        />

        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : profileExists ? "Update Profile" : "Save Profile"}
        </button>

        {profileExists && (
          <button onClick={handleDelete} style={styles.deleteBtn}>
            Delete Profile
          </button>
        )}
      </div>
    </>
  );
};

export default CustomerProfile;

const styles = {
  container: {
    maxWidth: 500,
    margin: "auto",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  deleteBtn: {
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    padding: 10,
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
};
