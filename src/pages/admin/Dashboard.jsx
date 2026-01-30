import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Admin Dashboard</h2>
        <Link to="/admin/workers">Manage Workers</Link>
      </div>
    </>
  );
};

export default AdminDashboard;
