import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getCustomerRequests } from "../../api/workRequestApi";
import { submitFeedback } from "../../api/feedbackApi";
import { payNow } from "../../api/paymentApi";
import StarRating from "../../components/StarRating";

const CustomerRequests = () => {
  const customerId = localStorage.getItem("userId");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [processingPayment, setProcessingPayment] = useState(null);
  const [submittingFeedback, setSubmittingFeedback] = useState(null);

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

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ---------- FETCH REQUESTS (LATEST FIRST) ---------- */
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
  const handlePayNow = async (paymentId) => {
    try {
      setProcessingPayment(paymentId);
      await payNow(paymentId);
      alert("Payment successful");
      fetchRequests();
    } catch {
      alert("Payment failed");
    } finally {
      setProcessingPayment(null);
    }
  };

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

      // ✅ Instant UI update (feedback won't reappear after reload)
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

          {loading && (
            <p style={{ color: darkMode ? "#ccc" : "#000" }}>
              Loading...
            </p>
          )}

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
                boxShadow: darkMode
                  ? "0 20px 45px rgba(0,0,0,0.6)"
                  : "0 20px 45px rgba(0,0,0,0.1)",
              }}
            >
              {/* HEADER */}
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

                  <div style={styles.row}>
                    <span>Pricing</span>
                    <b>{req.payment.pricingType}</b>
                  </div>

                  <span
                    style={{
                      ...styles.statusPill,
                      ...statusStyle(req.payment.status),
                      marginTop: 8,
                      display: "inline-block",
                    }}
                  >
                    {req.payment.status}
                  </span>

                  {req.payment.status === "PENDING" && (
                    <button
                      style={styles.payBtn}
                      disabled={
                        processingPayment === req.payment.paymentId
                      }
                      onClick={() =>
                        handlePayNow(req.payment.paymentId)
                      }
                    >
                      {processingPayment === req.payment.paymentId
                        ? "Processing..."
                        : "Pay Now"}
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
                      placeholder="Share your feedback (optional)"
                      style={{
                        ...styles.textarea,
                        background: darkMode ? "#1e1e1e" : "#fff",
                        color: darkMode ? "#fff" : "#000",
                        border: darkMode
                          ? "1px solid #444"
                          : "1px solid #ddd",
                      }}
                      onChange={(e) =>
                        setFeedback({
                          ...feedback,
                          [req.requestId]: {
                            ...feedback[req.requestId],
                            comment: e.target.value,
                          },
                        })
                      }
                    />

                    <button
                      style={styles.submitBtn}
                      disabled={
                        submittingFeedback === req.requestId
                      }
                      onClick={() =>
                        handleFeedbackSubmit(req.requestId)
                      }
                    >
                      {submittingFeedback === req.requestId
                        ? "Submitting..."
                        : "Submit Feedback"}
                    </button>
                  </div>
                )}

              {/* FEEDBACK DONE */}
              {req.feedback && (
                <div style={styles.successBox}>
                  ⭐ Thank you for your feedback!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
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
    transition: "0.3s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "18px",
  },
  service: {
    fontSize: "20px",
    marginBottom: "6px",
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
    marginTop: "6px",
  },
  textarea: {
    width: "100%",
    minHeight: "80px",
    marginTop: "12px",
    padding: "14px",
    borderRadius: "16px",
    resize: "none",
  },
  submitBtn: {
    marginTop: "14px",
    padding: "12px 22px",
    borderRadius: "22px",
    border: "none",
    background: "linear-gradient(135deg,#7b1fa2,#42a5f5)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  payBtn: {
    marginTop: "14px",
    padding: "12px 22px",
    borderRadius: "22px",
    border: "none",
    background: "#ff9800",
    fontWeight: "bold",
    cursor: "pointer",
  },
  successBox: {
    marginTop: "20px",
    padding: "14px",
    borderRadius: "18px",
    background: "#e8f5e9",
    color: "#2e7d32",
    fontWeight: "600",
    textAlign: "center",
  },
};

const statusStyle = (status) => {
  if (status === "PENDING")
    return { background: "#fff3e0", color: "#f57c00" };
  if (status === "ACCEPTED")
    return { background: "#e3f2fd", color: "#1976d2" };
  if (status === "COMPLETED")
    return { background: "#e8f5e9", color: "#2e7d32" };
  if (status === "PAID")
    return { background: "#e8f5e9", color: "#2e7d32" };
  return {};
};
