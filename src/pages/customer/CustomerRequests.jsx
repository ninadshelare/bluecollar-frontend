import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getCustomerRequests } from "../../api/workRequestApi";
import { submitFeedback } from "../../api/feedbackApi";
import StarRating from "../../components/StarRating";
import OtpPaymentModal from "../../components/payment/OtpPaymentModal";


const CustomerRequests = () => {
  const customerId = localStorage.getItem("userId");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [processingPayment, setProcessingPayment] = useState(null);
  const [submittingFeedback, setSubmittingFeedback] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [activePaymentId, setActivePaymentId] = useState(null);


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

  /* ---------- PREMIUM POPUP STATE ---------- */
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmType, setConfirmType] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ---------- FETCH REQUESTS ---------- */
  const fetchRequests = async () => {
    try {
      const res = await getCustomerRequests(customerId);
      const sorted = [...(res.data || [])].sort(
        (a, b) => b.requestId - a.requestId
      );
      setRequests(sorted);
    } catch {
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- PAYMENT ---------- */


  /* ---------- FEEDBACK ---------- */
  const handleFeedbackSubmit = async (requestId) => {
    const data = feedback[requestId];
    if (!data?.rating) {
      alert("Please select rating");
      return;
    }

    try {
      setSubmittingFeedback(requestId);

      await submitFeedback({
        requestId,
        rating: data.rating,
        comment: data.comment || "",
      });

      setRequests((prev) =>
        prev.map((req) =>
          req.requestId === requestId
            ? {
              ...req,
              feedback: {
                rating: data.rating,
                comment: data.comment || "",
              },
            }
            : req
        )
      );
    } catch {
      alert("Failed to submit feedback");
    } finally {
      setSubmittingFeedback(null);
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
        <div style={styles.container}>
          <h2
            style={{
              ...styles.heading,
              color: darkMode ? "#fff" : "#000",
            }}
          >
            My Service Requests
          </h2>

          {loading && <p style={{ color: darkMode ? "#ccc" : "#000" }}>Loading...</p>}

          {!loading && requests.length === 0 && (
            <p style={{ color: darkMode ? "#ccc" : "#000" }}>
              No requests found
            </p>
          )}

          {requests.map((req) => (
            <div
              key={req.requestId}
              style={{
                ...styles.card,
                background: darkMode ? "#1e1e1e" : "rgba(255,255,255,0.95)",
                color: darkMode ? "#fff" : "#000",
              }}
            >
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.service}>{req.serviceName}</h3>
                  {req.worker && (
                    <p style={{ color: darkMode ? "#bbb" : "#555" }}>
                      👷 {req.worker.name}
                    </p>
                  )}
                </div>

                <span
                  style={{
                    ...styles.statusPill,
                    ...statusStyle(req.status),
                  }}
                >
                  {req.status}
                </span>
              </div>

              {/* PAYMENT */}
              {req.status === "COMPLETED" && req.payment && (
                <div
                  style={{
                    ...styles.sectionCard,
                    background: darkMode ? "#2a2a2a" : "#f9f9f9",
                  }}
                >
                  <h4>💳 Payment</h4>

                  <div style={styles.row}>
                    <span>Amount</span>
                    <b>₹{req.payment.amount}</b>
                  </div>

                  {req.payment.status === "PENDING" && (
                    <button
                      style={styles.payBtn}
                      onClick={() => {
                        setConfirmType("PAY");
                        setSelectedId(req.payment.paymentId);
                        setShowConfirmPopup(true);
                      }}
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              )}

              {/* FEEDBACK */}
              {req.payment &&
                req.payment.status === "PAID" &&
                !req.feedback && (
                  <div
                    style={{
                      ...styles.sectionCard,
                      background: darkMode ? "#2a2a2a" : "#f9f9f9",
                    }}
                  >
                    <h4>⭐ Rate Your Experience</h4>

                    <StarRating
                      rating={feedback[req.requestId]?.rating || 0}
                      onChange={(rating) =>
                        setFeedback({
                          ...feedback,
                          [req.requestId]: {
                            ...feedback[req.requestId],
                            rating,
                          },
                        })
                      }
                    />
                    <textarea
  placeholder="Write your feedback (optional)"
  value={feedback[req.requestId]?.comment || ""}
  onChange={(e) =>
    setFeedback({
      ...feedback,
      [req.requestId]: {
        ...feedback[req.requestId],
        comment: e.target.value,
      },
    })
  }
  onFocus={(e) => {
    e.target.style.boxShadow = darkMode
      ? "0 0 0 2px rgba(123,31,162,0.6)"
      : "0 0 0 2px rgba(66,165,245,0.4)";
  }}
  onBlur={(e) => {
    e.target.style.boxShadow = darkMode
      ? "0 8px 20px rgba(0,0,0,0.4)"
      : "0 8px 20px rgba(0,0,0,0.08)";
  }}
  style={{
    marginTop: "16px",
    width: "100%",
    minHeight: "100px",
    borderRadius: "20px",
    padding: "16px",
    border: darkMode ? "1px solid #333" : "1px solid #e0e0e0",
    background: darkMode
      ? "linear-gradient(145deg,#2a2a2a,#242424)"
      : "#ffffff",
    color: darkMode ? "#fff" : "#333",
    resize: "none",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.25s ease",
    boxShadow: darkMode
      ? "0 8px 20px rgba(0,0,0,0.4)"
      : "0 8px 20px rgba(0,0,0,0.08)",
  }}
/>


                    <button
                      style={{
                        ...styles.submitBtn,
                        opacity: feedback[req.requestId]?.rating ? 1 : 0.5,
                        cursor: feedback[req.requestId]?.rating ? "pointer" : "not-allowed",
                      }}
                      disabled={!feedback[req.requestId]?.rating}
                      onClick={() => {
                        setConfirmType("FEEDBACK");
                        setSelectedId(req.requestId);
                        setShowConfirmPopup(true);
                      }}
                    >
                      Submit Feedback
                    </button>

                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* PREMIUM POPUP */}
      {showConfirmPopup && (
  <div style={popupStyles.overlay}>
    <div
      style={{
        ...popupStyles.popup,
        background: darkMode
          ? "#1e1e1e"
          : "rgba(255,255,255,0.95)",
        color: darkMode ? "#fff" : "#333",
      }}
    >
      <div style={popupStyles.iconCircle}>
        {confirmType === "PAY" ? "💳" : "⭐"}
      </div>

      <h3 style={popupStyles.popupTitle}>
        {confirmType === "PAY"
          ? "Confirm Payment?"
          : "Submit Feedback?"}
      </h3>

      <p
        style={{
          ...popupStyles.popupText,
          color: darkMode ? "#bbb" : "#666",
        }}
      >
        {confirmType === "PAY"
          ? "Do you want to proceed with this payment?"
          : "Are you sure you want to submit this feedback?"}
      </p>

      <div style={popupStyles.popupActions}>
        <button
          style={popupStyles.confirmBtn}
          onClick={() => {
            if (confirmType === "PAY") {
              setActivePaymentId(selectedId);
              setShowOtpModal(true);
            } else {
              handleFeedbackSubmit(selectedId);
            }
            setShowConfirmPopup(false);
          }}
        >
          Yes, Continue
        </button>

        <button
          style={{
            ...popupStyles.cancelBtn,
            border: darkMode
              ? "1px solid #444"
              : "1px solid #ddd",
            background: darkMode
              ? "#2a2a2a"
              : "#fff",
            color: darkMode ? "#fff" : "#333",
          }}
          onClick={() => setShowConfirmPopup(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      {showOtpModal && (
        <OtpPaymentModal
          paymentId={activePaymentId}
          onSuccess={() => {
            setShowOtpModal(false);
            fetchRequests(); // refresh status
          }}
          onClose={() => setShowOtpModal(false)}
        />
      )}

    </>
  );
};

export default CustomerRequests;

/* ------------------ STYLES ------------------ */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "60px 20px",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: "1000px",
  },
  heading: {
    fontSize: "30px",
    marginBottom: "35px",
  },
  card: {
    borderRadius: "28px",
    padding: "26px",
    marginBottom: "28px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
  service: {
    fontSize: "20px",
  },
  statusPill: {
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },
  sectionCard: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
  },
  submitBtn: {
    marginTop: "14px",
    padding: "12px 22px",
    borderRadius: "22px",
    border: "none",
    background: "linear-gradient(135deg,#7b1fa2,#42a5f5)",
    color: "#fff",
    cursor: "pointer",
  },
  payBtn: {
    marginTop: "14px",
    padding: "12px 22px",
    borderRadius: "22px",
    border: "none",
    background: "#ff9800",
    cursor: "pointer",
  },
};

const popupStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  popup: {
    padding: "40px",
    borderRadius: "30px",
    width: "360px",
    textAlign: "center",
    boxShadow: "0 25px 70px rgba(0,0,0,0.4)",
  },

  iconCircle: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#7b1fa2,#42a5f5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    margin: "0 auto 20px",
    color: "#fff",
  },

  popupTitle: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "10px",
  },

  popupText: {
    fontSize: "14px",
    marginBottom: "25px",
  },

  popupActions: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },

  confirmBtn: {
    padding: "12px 22px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(135deg,#7b1fa2,#42a5f5)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  cancelBtn: {
    padding: "12px 22px",
    borderRadius: "25px",
    fontWeight: "500",
    cursor: "pointer",
  },
};


const statusStyle = (status) => {
  if (status === "PENDING")
    return { background: "#fff3e0", color: "#f57c00" };
  if (status === "ACCEPTED")
    return { background: "#e3f2fd", color: "#1976d2" };
  if (status === "COMPLETED" || status === "PAID")
    return { background: "#e8f5e9", color: "#2e7d32" };
  return {};
};
