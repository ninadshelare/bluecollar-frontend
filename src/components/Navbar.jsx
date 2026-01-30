import logo from "../assets/logo.png";
import { logout } from "../utils/auth";

const Navbar = () => {
  const role = localStorage.getItem("role");

  return (
    <div style={styles.nav}>
      <div style={styles.left}>
        <img src={logo} alt="logo" style={styles.logo} />
        <span style={styles.title}>Blue Collar</span>
      </div>

      <div style={styles.right}>
        <span style={styles.role}>{role}</span>
        <button onClick={logout} style={styles.btn}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#0d47a1",
    color: "#fff",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    width: "36px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  role: {
    fontSize: "14px",
  },
  btn: {
    background: "#fff",
    color: "#0d47a1",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
