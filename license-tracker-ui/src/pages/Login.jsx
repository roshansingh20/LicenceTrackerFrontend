import { useState } from "react";
import axios from "axios";
import { setToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5500/api/auth/login", {
        email,
        password,
      });

      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 relative overflow-hidden">

      {/* Floating Background Blobs */}
      <div className="absolute w-96 h-96 bg-pink-400/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/15 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 transform transition duration-500 hover:scale-[1.02]">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-4xl font-extrabold text-white tracking-wide">
            🔐 License<span className="text-yellow-300">Tracker</span>
          </div>
          <p className="text-white/70 text-sm mt-1">
            Secure License & Asset Management
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-200 bg-red-500/20 p-2 rounded text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-white/80 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@company.com"
              className="w-full mt-1 px-4 py-2 rounded bg-white/20 text-white placeholder-white/60 outline-none border border-white/30 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-white/80 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2 rounded bg-white/20 text-white placeholder-white/60 outline-none border border-white/30 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-200 hover:bg-green-300 text-indigo-900 font-semibold py-2 rounded-lg shadow-lg transition duration-300 active:scale-95"
          >
            Login Securely →
          </button>
          <p
            onClick={() => navigate("/forgot-password")}
            className="text-white-600 text-sm mt-4 cursor-pointer text-center hover:extrabold"
          >
            Forgot Password?
          </p>

        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-white/60 text-xs">
          © 2026 License Tracker • Internal Enterprise Tool
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-4 right-6 text-white/20 text-sm tracking-widest">
        LOGIN PAGE
      </div>
    </div>
  );
}
