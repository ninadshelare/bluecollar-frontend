import { useState } from "react";
import { initiatePayment, verifyOtpPayment } from "../../api/paymentApi";

const OtpPaymentModal = ({ paymentId, amount, onSuccess, onClose }) => {
  const [step, setStep] = useState("INIT");
  const [sessionId, setSessionId] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const startPayment = async () => {
    try {
      const res = await initiatePayment(paymentId);
      setSessionId(res.data.paymentSessionId);
      setStep("OTP");
    } catch {
      setError("Failed to initiate payment");
    }
  };

  const verifyOtp = async () => {
    try {
      setStep("PROCESSING");

      const res = await verifyOtpPayment(paymentId, {
        paymentSessionId: sessionId,
        otp,
      });

      setStep("SUCCESS");

      // Refresh parent after 2 seconds
      setTimeout(() => {
        onSuccess(res.data);
      }, 2000);

    } catch {
      setStep("OTP");
      setError("Invalid OTP");
    }
  };

  return (
    <div style={overlay}>
      <div style={checkoutBox}>

        {step !== "SUCCESS" && (
          <>
            {/* Header */}
            <div style={header}>
              <div>
                <div style={merchant}>Blue Collar Services</div>
                <div style={order}>Order ID: {paymentId}</div>
              </div>
              <div style={secured}>🔒 Secured by Razorpay</div>
            </div>

            {/* Amount */}
            <div style={amountSection}>
              <div style={amountLabel}>Amount to Pay</div>
              <div style={amountText}>
                ₹ {amount ? Number(amount).toFixed(2) : "0.00"}
              </div>
            </div>

            <div style={divider}></div>
          </>
        )}

        <div style={body}>

          {step === "INIT" && (
            <>
              <div style={infoBox}>
                You will receive an OTP on your registered mobile number.
              </div>
              <button style={primaryBtn} onClick={startPayment}>
                Pay ₹ {amount}
              </button>
            </>
          )}

          {step === "OTP" && (
            <>
              <div style={otpTitle}>Enter 6-digit OTP</div>
              <input
                style={otpInput}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="••••••"
                maxLength={6}
              />
              <button style={primaryBtn} onClick={verifyOtp}>
                Confirm Payment
              </button>
              <div style={hint}>Demo OTP: 123456</div>
            </>
          )}

          {step === "PROCESSING" && (
            <div style={processingBox}>
              <div style={loader}></div>
              <div style={{ marginTop: 15 }}>
                Processing your transaction...
              </div>
            </div>
          )}

          {step === "SUCCESS" && (
            <div style={successBox}>
              <div style={successIcon}>✔</div>
              <h3>Payment Successful</h3>
              <p>Your payment of ₹{amount} has been completed.</p>
            </div>
          )}

          {error && <div style={errorText}>{error}</div>}
        </div>

        {step !== "SUCCESS" && (
          <div style={footer}>
            <button style={cancelBtn} onClick={onClose}>
              Cancel
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default OtpPaymentModal;


const overlay = {
  position: "fixed",
  inset: 0,
  background: "#f4f6f8",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  fontFamily: "Inter, system-ui",
};

const checkoutBox = {
  width: 420,
  background: "#ffffff",
  borderRadius: 10,
  boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
  overflow: "hidden",
};

const header = {
  padding: "20px",
  borderBottom: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const merchant = {
  fontWeight: 600,
  fontSize: 15,
};

const order = {
  fontSize: 12,
  color: "#888",
  marginTop: 4,
};

const secured = {
  fontSize: 12,
  color: "#0F4CFF",
  fontWeight: 600,
};

const amountSection = {
  padding: "20px",
};

const amountLabel = {
  fontSize: 12,
  color: "#888",
};

const amountText = {
  fontSize: 26,
  fontWeight: 700,
  marginTop: 5,
};

const divider = {
  height: 1,
  background: "#eee",
};

const body = {
  padding: "25px",
};

const infoBox = {
  background: "#f9fafb",
  padding: 15,
  borderRadius: 6,
  marginBottom: 20,
  fontSize: 14,
};

const otpTitle = {
  fontSize: 14,
  marginBottom: 10,
};

const otpInput = {
  width: "100%",
  padding: 12,
  borderRadius: 6,
  border: "1px solid #ddd",
  marginBottom: 20,
  fontSize: 16,
};

const primaryBtn = {
  width: "100%",
  padding: 14,
  background: "#0F4CFF",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
};

const processingBox = {
  textAlign: "center",
  padding: "30px 0",
};

const loader = {
  width: 30,
  height: 30,
  border: "4px solid #eee",
  borderTop: "4px solid #0F4CFF",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const errorText = {
  color: "red",
  fontSize: 13,
  marginTop: 10,
};
const hint = {
  fontSize: 12,
  color: "#777",
  marginTop: 10,
};


const footer = {
  borderTop: "1px solid #eee",
  padding: 15,
  textAlign: "center",
};

const cancelBtn = {
  background: "transparent",
  border: "none",
  color: "#666",
  cursor: "pointer",
};
const successBox = {
  textAlign: "center",
  padding: "30px 0",
};

const successIcon = {
  width: 70,
  height: 70,
  borderRadius: "50%",
  background: "#4CAF50",
  color: "#fff",
  fontSize: 32,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto 20px",
};
