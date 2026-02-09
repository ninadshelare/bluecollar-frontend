import { useState } from "react";
import { initiatePayment, verifyOtpPayment } from "../../api/paymentApi";

const OtpPaymentModal = ({ paymentId, amount, onSuccess, onClose }) => {
  const [step, setStep] = useState("INIT"); // INIT | OTP | PROCESSING
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
      onSuccess(res.data);
    } catch {
      setStep("OTP");
      setError("Invalid OTP");
    }
  };

  return (
    <div style={overlay}>
      <div style={container}>

        {/* Header */}
        <div style={header}>
          <div>
            <div style={merchant}>Blue Collar Services</div>
            <div style={order}>Order ID: {paymentId}</div>
          </div>
          <div style={secure}>🔒 Secured by Razorpay</div>
        </div>

        {/* Amount Section */}
        <div style={amountSection}>
          <div style={amountLabel}>Amount to Pay</div>
          <div style={amount}>
            ₹ {amount ? Number(amount).toFixed(2) : "0.00"}
          </div>
        </div>

        <div style={divider}></div>

        {/* Payment Body */}
        <div style={body}>

          {step === "INIT" && (
            <>
              <div style={verificationBox}>
                Bank verification required to complete payment.
              </div>

              <button style={primaryBtn} onClick={startPayment}>
                Pay ₹ {amount}
              </button>
            </>
          )}

          {step === "OTP" && (
            <>
              <div style={otpLabel}>
                Enter OTP sent to your registered mobile number
              </div>

              <input
                style={otpInput}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6 digit OTP"
                maxLength={6}
              />

              <button style={primaryBtn} onClick={verifyOtp}>
                Confirm Payment
              </button>

              <div style={hint}>Demo OTP: 123456</div>
            </>
          )}

          {step === "PROCESSING" && (
            <div style={processing}>
              <div style={loader}></div>
              <div style={{ marginTop: 15 }}>
                Processing your transaction...
              </div>
            </div>
          )}

          {error && <div style={errorText}>{error}</div>}

        </div>

        <div style={footer}>
          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default OtpPaymentModal;


const overlay = {
  position: "fixed",
  inset: 0,
  background: "#f5f7fa",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  fontFamily: "Inter, system-ui",
};

const container = {
  width: 450,
  background: "#ffffff",
  borderRadius: 8,
  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  overflow: "hidden",
};

const header = {
  padding: "20px",
  borderBottom: "1px solid #eaeaea",
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

const secure = {
  fontSize: 12,
  color: "#0F4CFF",
  fontWeight: 500,
};

const amountSection = {
  padding: "20px",
};

const amountLabel = {
  fontSize: 12,
  color: "#888",
};

const amount = {
  fontSize: 26,
  fontWeight: 700,
  marginTop: 5,
};

const divider = {
  height: 1,
  background: "#eaeaea",
};

const body = {
  padding: "25px",
};

const verificationBox = {
  background: "#f9fafb",
  padding: 15,
  borderRadius: 6,
  marginBottom: 20,
  fontSize: 14,
};

const otpLabel = {
  fontSize: 14,
  marginBottom: 10,
};

const otpInput = {
  width: "100%",
  padding: 12,
  borderRadius: 6,
  border: "1px solid #dcdcdc",
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

const processing = {
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

const hint = {
  fontSize: 12,
  color: "#777",
  marginTop: 10,
};

const errorText = {
  color: "red",
  fontSize: 13,
  marginTop: 10,
};

const footer = {
  borderTop: "1px solid #eaeaea",
  padding: 15,
  textAlign: "center",
};

const cancelBtn = {
  background: "transparent",
  border: "none",
  color: "#666",
  cursor: "pointer",
};
