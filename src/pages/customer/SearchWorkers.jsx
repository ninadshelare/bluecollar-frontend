import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { searchWorkers } from "../../api/jobApi";
import { createWorkRequest } from "../../api/workRequestApi";

const SearchWorkers = () => {
  const customerId = localStorage.getItem("userId");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [activeBookingWorkerId, setActiveBookingWorkerId] = useState(
    localStorage.getItem("activeBookingWorkerId")
  );

  const [filters, setFilters] = useState({ service: "" });
  const [serviceOpen, setServiceOpen] = useState(false);

  const services = [
    "ELECTRICIAN",
    "PLUMBER",
    "PAINTER",
    "CARPENTER",
  ];

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  /* ✅ NEW POPUP STATES */
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!filters.service) {
      alert("Please select a service");
      return;
    }

    setLoading(true);
    try {
      const res = await searchWorkers({
        service: filters.service,
        available: true,
      });
      setWorkers(res.data);
    } catch {
      alert("Failed to search workers");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ UPDATED BOOK FUNCTION (after confirmation) */
  const handleBook = async () => {
    if (!selectedWorker) return;

    try {
      setBookingId(selectedWorker);

      await createWorkRequest(
        Number(selectedWorker)
      );

      localStorage.setItem(
        "activeBookingWorkerId",
        selectedWorker
      );
      setActiveBookingWorkerId(selectedWorker);

      setShowConfirm(false);
    } catch {
      alert("Failed to book service");
    } finally {
      setBookingId(null);
    }
  };

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
            ...styles.container,
            background: darkMode ? "#1e1e1e" : "#ffffff",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <h2 style={styles.heading}>Search Workers</h2>

          <div style={styles.filterRow}>
            <div style={styles.dropdown}>
              <div
                style={{
                  ...styles.dropdownHeader,
                  background: darkMode ? "#2a2a2a" : "#f5f5f5",
                  color: darkMode ? "#fff" : "#000",
                }}
                onClick={() => setServiceOpen(!serviceOpen)}
              >
                <span>
                  {filters.service || "Select Service"}
                </span>
                <span
                  style={{
                    ...styles.arrow,
                    transform: serviceOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  ▾
                </span>
              </div>

              {serviceOpen && (
                <div
                  style={{
                    ...styles.dropdownMenu,
                    background: darkMode
                      ? "#2a2a2a"
                      : "#ffffff",
                  }}
                >
                  {services.map((s) => (
                    <div
                      key={s}
                      style={{
                        ...styles.dropdownItem,
                        color: darkMode ? "#fff" : "#000",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          darkMode
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(0,0,0,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "transparent";
                      }}
                      onClick={() => {
                        setFilters({ service: s });
                        setServiceOpen(false);
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleSearch}
              style={styles.searchBtn}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {workers.length === 0 && !loading && (
            <p style={styles.empty}>No workers found</p>
          )}

          <div style={styles.grid}>
            {workers.map((w) => {
              const bookingLocked =
                Boolean(activeBookingWorkerId);

              return (
                <div
                  key={w.workerId}
                  style={{
                    ...styles.card,
                    background: darkMode
                      ? "#232323"
                      : "#ffffff",
                  }}
                >
                  <div style={styles.avatar}>
                    {w.name.charAt(0).toUpperCase()}
                  </div>

                  <h4>{w.name}</h4>
                  <p>⭐ Rating: {w.rating ?? "N/A"}</p>
                  <p>
                    {w.experienceYears} years experience
                  </p>

                  <p
                    style={{
                      color: w.available
                        ? "#4caf50"
                        : "#f44336",
                      fontWeight: 600,
                    }}
                  >
                    ●{" "}
                    {w.available
                      ? "Available"
                      : "Busy"}
                  </p>

                  <button
                    onClick={() => {
                      setSelectedWorker(w.workerId);
                      setShowConfirm(true);
                    }}
                    disabled={
                      bookingLocked ||
                      !w.available ||
                      bookingId === w.workerId
                    }
                    style={{
                      ...styles.bookBtn,
                      opacity: bookingLocked ? 0.5 : 1,
                      cursor: bookingLocked
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    {bookingLocked
                      ? "Booking Locked"
                      : bookingId === w.workerId
                      ? "Booking..."
                      : "Book Service"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ✅ PREMIUM CONFIRM POPUP */}
      {showConfirm && (
        <div style={popupStyles.overlay}>
          <div
            style={{
              ...popupStyles.popup,
              background: darkMode
                ? "#1e1e2f"
                : "#ffffff",
              color: darkMode ? "#fff" : "#333",
            }}
          >
            <div style={popupStyles.iconCircle}>
              ⚡
            </div>

            <h3 style={popupStyles.title}>
              Confirm Booking?
            </h3>

            <p style={popupStyles.text}>
              Are you sure you want to book this
              worker?
            </p>

            <div style={popupStyles.actions}>
              <button
                style={popupStyles.confirmBtn}
                onClick={handleBook}
              >
                Yes, Book Now
              </button>

              <button
                style={popupStyles.cancelBtn}
                onClick={() =>
                  setShowConfirm(false)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchWorkers;

/* ---------- STYLES ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "60px 20px",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: "1100px",
    padding: "40px",
    borderRadius: "28px",
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.15)",
  },
  heading: {
    fontSize: "26px",
    marginBottom: "25px",
  },
  filterRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "35px",
  },
  dropdown: {
    position: "relative",
    flex: 1,
  },
  dropdownHeader: {
    padding: "16px",
    borderRadius: "18px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "inset 0 2px 6px rgba(0,0,0,0.08)",
  },
  arrow: {
    transition: "0.3s",
    fontSize: "18px",
  },
  dropdownMenu: {
    position: "absolute",
    top: "110%",
    width: "100%",
    borderRadius: "18px",
    boxShadow:
      "0 15px 35px rgba(0,0,0,0.2)",
    zIndex: 10,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: "14px 16px",
    cursor: "pointer",
  },
  searchBtn: {
    padding: "16px 24px",
    borderRadius: "20px",
    border: "none",
    background:
      "linear-gradient(135deg,#7b1fa2,#42a5f5)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(260px,1fr))",
    gap: "25px",
  },
  card: {
    padding: "26px",
    borderRadius: "24px",
    textAlign: "center",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.08)",
  },
  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#42a5f5,#1976d2)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 auto 15px auto",
  },
  bookBtn: {
    marginTop: "12px",
    padding: "12px",
    borderRadius: "20px",
    border: "none",
    background: "#4caf50",
    color: "#fff",
    fontWeight: "bold",
    width: "100%",
  },
  empty: {
    textAlign: "center",
    opacity: 0.7,
  },
};

/* PREMIUM POPUP STYLES */

const popupStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5000,
  },
  popup: {
    padding: "40px",
    borderRadius: "28px",
    width: "360px",
    textAlign: "center",
    boxShadow:
      "0 25px 70px rgba(0,0,0,0.4)",
  },
  iconCircle: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#7b1fa2,#42a5f5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    margin: "0 auto 20px",
    color: "#fff",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  text: {
    fontSize: "14px",
    opacity: 0.8,
    marginBottom: "25px",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  confirmBtn: {
    padding: "12px 20px",
    borderRadius: "25px",
    border: "none",
    background:
      "linear-gradient(135deg,#7b1fa2,#42a5f5)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "12px 20px",
    borderRadius: "25px",
    border: "1px solid #ccc",
    background: "transparent",
    cursor: "pointer",
  },
};