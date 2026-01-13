import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5500/api/auth";

  async function sendOtp() {
    setLoading(true);
    try {
      await axios.post(`${API}/forgot-password`, { email });
      setMsg("OTP sent to your registered email");
      setStep(2);
    } catch (err) {
      setMsg(err.response?.data || "Email not found");
    }
    setLoading(false);
  }

  async function verifyOtp() {
    setLoading(true);
    try {
      await axios.post(`${API}/verify-otp`, { email, otp });
      setMsg("OTP verified. Set new password.");
      setStep(3);
    } catch (err) {
      setMsg(err.response?.data || "Invalid OTP");
    }
    setLoading(false);
  }

  async function resetPassword() {
    setLoading(true);
    try {
      await axios.post(`${API}/reset-password`, {
        email,
        otp,
        newPassword,
      });
      setMsg("Password reset successful. You can now login.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setMsg(err.response?.data || "Password reset failed");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[420px]">
        <h2 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        {msg && <p className="text-center mb-4 text-sm text-indigo-700">{msg}</p>}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter registered email"
              className="border p-3 w-full rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Send OTP
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="border p-3 w-full rounded mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              className="border p-3 w-full rounded mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
