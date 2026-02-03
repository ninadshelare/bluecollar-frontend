import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -------- CHECK IF PROFILE EXISTS -------- */
  useEffect(() => {
    axiosInstance
      .get(`/api/workers/profile/by-user/${userId}`)
      .then((res) => {
        setProfile(res.data);
        localStorage.setItem("workerProfileId", res.data.workerId);
      })
      .catch(() => {
        setProfile(null);
        localStorage.removeItem("workerProfileId");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  /* -------- DELETE PROFILE -------- */
  const handleDeleteProfile = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile?"
    );

    if (!confirmDelete) return;

    const workerId = localStorage.getItem("workerProfileId");

    try {
      await axiosInstance.delete(`/api/workers/profile/${workerId}`);
      localStorage.removeItem("workerProfileId");
      setProfile(null);
      alert("Profile deleted successfully");
    } catch (err) {
      alert("Failed to delete profile");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: 20 }}>Loading...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>Worker Dashboard</h2>

        {/* ✅ MY JOBS */}
        <button
          onClick={() => navigate("/worker/jobs")}
          style={styles.primaryBtn}
        >
          My Jobs
        </button>

        <div style={{ marginTop: 20 }}>
          {/* ❌ PROFILE NOT CREATED */}
          {!profile && (
            <button
              onClick={() => navigate("/worker/profile")}
              style={styles.primaryBtn}
            >
              Complete Profile
            </button>
          )}

          {/* ✅ PROFILE EXISTS */}
          {profile && (
            <>
              <button
                onClick={() => navigate("/worker/profile")}
                style={styles.primaryBtn}
              >
                Update Profile
              </button>

              <button
                onClick={handleDeleteProfile}
                style={styles.deleteBtn}
              >
                Delete Profile
              </button>

              {/* 👩‍🍳 MAID-ONLY BUTTONS */}
              {profile.workerType === "MAID" && (
                <>
                  <button
                    onClick={() => navigate("/worker/attendance")}
                    style={styles.primaryBtn}
                  >
                    Attendance
                  </button>

                  <button
                    onClick={() => navigate("/worker/salary")}
                    style={styles.primaryBtn}
                  >
                    Salary
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkerDashboard;

/* ---------- STYLES ---------- */

const styles = {
  container: {
    padding: 20,
  },
  primaryBtn: {
    padding: "12px 20px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginRight: 10,
    marginBottom: 10,
  },
  deleteBtn: {
    padding: "12px 20px",
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
