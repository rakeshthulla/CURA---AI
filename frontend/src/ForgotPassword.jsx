import React, { useState } from "react";
import API_BASE_URL from "./apiConfig";
import { Link } from "react-router-dom";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ error: data.message || "Failed to send reset email" });
      } else {
        setStatus({ success: data.message || "If that email exists, a reset link was sent." });
      }
    } catch (err) {
      setStatus({ error: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <div className="auth-modal-content">
          <h2>Forgot Password</h2>
          <p>Enter your email and we'll send a reset link.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
          {status?.success && <div className="success-message">{status.success}</div>}
          {status?.error && <div className="error-message">{status.error}</div>}
          <p><Link to="/login">Back to login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
