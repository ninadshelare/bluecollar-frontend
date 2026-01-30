import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const WorkerDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Worker Dashboard</h2>

        <button
          onClick={() => navigate("/worker/jobs")}
          style={styles.button}
        >
          My Jobs
        </button>
        <button onClick={() => navigate("/worker/profile")}>
          Complete Profile
        </button>

      </div>
    </>
  );
};

export default WorkerDashboard;

const styles = {
  button: {
    padding: "10px 20px",
    marginTop: "15px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};