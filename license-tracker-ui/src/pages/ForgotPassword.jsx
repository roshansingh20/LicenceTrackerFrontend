import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // UI-only (backend can be added later)
    setMessage(
      "If this email exists, password reset instructions will be sent."
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Forgot Password
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your registered email
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="admin@prodapt.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="text-green-600 text-sm text-center mt-4">
            {message}
          </p>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-indigo-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
