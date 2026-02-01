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
  const [submitting, setSubmitting] = useState(null);
  const [paying, setPaying] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getCustomerRequests(customerId);
      setRequests(res.data);
    } catch {
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  /* 💳 PAY NOW */
  const handlePayNow = async (paymentId) => {
    try {
      setPaying(paymentId);
      await payNow(paymentId);
      alert("Payment successful");
      fetchRequests();
    } catch {
      alert("Payment failed");
    } finally {
      setPaying(null);
    }
  };

  /* ⭐ FEEDBACK */
  const handleFeedbackSubmit = async (requestId) => {
    const data = feedback[requestId];
    if (!data?.rating) {
      alert("Please give rating");
      return;
    }

    try {
      setSubmitting(requestId);
      await submitFeedback({
        requestId,
        rating: data.rating,
        comment: data.comment || "",
      });
      alert("Feedback submitted successfully");
      fetchRequests();
    } catch {
      alert("Failed to submit feedback");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>My Requests</h2>

        {loading && <p>Loading...</p>}
        {!loading && requests.length === 0 && <p>No requests found</p>}

        {requests.map((req) => (
          <div key={req.requestId} style={styles.card}>
            <p><b>Service:</b> {req.serviceName}</p>
            <p>
              <b>Status:</b>{" "}
              <span style={statusStyle(req.status)}>{req.status}</span>
            </p>

            {req.worker && <p><b>Worker:</b> {req.worker.name}</p>}

            {/* 💳 PAYMENT */}
            {req.payment && (
              <div style={styles.payment}>
                <p><b>Amount:</b> ₹{req.payment.amount}</p>
                <p><b>Pricing:</b> {req.payment.pricingType}</p>
                <p>
                  <b>Status:</b>{" "}
                  <span style={statusStyle(req.payment.status)}>
                    {req.payment.status}
                  </span>
                </p>

                {req.payment.status === "PENDING" && (
                  <button
                    style={styles.payBtn}
                    disabled={paying === req.payment.paymentId}
                    onClick={() => handlePayNow(req.payment.paymentId)}
                  >
                    {paying === req.payment.paymentId
                      ? "Paying..."
                      : "Pay Now"}
                  </button>
                )}
              </div>
            )}

            {/* ⭐ FEEDBACK */}
            {req.payment?.status === "PAID" && !req.feedback && (
              <div style={styles.feedback}>
                <h4>Rate Service</h4>

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
                  placeholder="Write a comment (optional)"
                  style={styles.textarea}
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
                  onClick={() => handleFeedbackSubmit(req.requestId)}
                  style={styles.btn}
                  disabled={submitting === req.requestId}
                >
                  {submitting === req.requestId
                    ? "Submitting..."
                    : "Submit Feedback"}
                </button>
              </div>
            )}

            {/* ✅ FEEDBACK GIVEN */}
            {req.feedback && (
              <p style={{ color: "#2e7d32", fontWeight: "bold" }}>
                Feedback Submitted ⭐ {req.feedback.rating}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default CustomerRequests;

/* ---------- STYLES ---------- */

const styles = {
  container: {
    padding: 20,
    maxWidth: 900,
    margin: "auto",
  },
  card: {
    border: "1px solid #ccc",
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  payment: {
    background: "#f1f8e9",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  feedback: {
    marginTop: 14,
  },
  textarea: {
    width: "100%",
    minHeight: 60,
    marginTop: 8,
    padding: 8,
  },
  btn: {
    marginTop: 8,
    padding: "8px 14px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  payBtn: {
    marginTop: 10,
    padding: "8px 14px",
    background: "#ff9800",
    color: "#000",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

const statusStyle = (status) => {
  if (status === "PENDING") return { color: "#f57c00" };
  if (status === "ACCEPTED") return { color: "#1976d2" };
  if (status === "COMPLETED") return { color: "#2e7d32" };
  if (status === "PAID") return { color: "#2e7d32", fontWeight: "bold" };
};
