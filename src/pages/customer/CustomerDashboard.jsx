import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2>Welcome, {name}</h2>

        <button
          onClick={() => navigate("/customer/search")}
          style={styles.button}
        >
          Search Services
        </button>
      </div>
    </>
  );
};

export default CustomerDashboard;

const styles = {
  button: {
    padding: "12px 20px",
    marginTop: "15px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
