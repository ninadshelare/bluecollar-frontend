import { useState } from "react";
import { initiatePayment, verifyOtpPayment } from "../../api/paymentApi";

const OtpPaymentModal = ({ paymentId, onSuccess, onClose }) => {
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
      <div style={modal}>
        <h3>Secure Payment</h3>

        {step === "INIT" && (
          <button onClick={startPayment}>Proceed to Pay</button>
        )}

        {step === "OTP" && (
          <>
            <p>Enter OTP sent to your mobile</p>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button onClick={verifyOtp}>Verify & Pay</button>
            <p style={{ fontSize: 12 }}>Demo OTP: <b>123456</b></p>
          </>
        )}

        {step === "PROCESSING" && <p>Processing...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={onClose} style={{ marginTop: 10 }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OtpPaymentModal;

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modal = {
  background: "#fff",
  padding: 25,
  borderRadius: 20,
  width: 300,
  textAlign: "center",
};
