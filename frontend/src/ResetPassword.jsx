import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "./apiConfig";
import "./Auth.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    if (t) setToken(t);
    else setStatus({ error: "Invalid or missing reset token." });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (password.length < 6) return setStatus({ error: "Password must be at least 6 characters." });
    if (password !== confirm) return setStatus({ error: "Passwords do not match." });

    setLoading(true);
    setStatus(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setStatus({ error: data.message || "Password reset failed." });
      } else {
        setStatus({ success: data.message || "Password reset successful." });
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch {
      setStatus({ error: "Network error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <div className="auth-modal-content">
          <h2>Reset Password</h2>
          {!token && <p className="error-message">Invalid reset link.</p>}
          {token && (
            <form onSubmit={handleSubmit} className="auth-form">
              <input
                type={showPw ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <button
                type="button"
                className="continue-btn"
                style={{ background: "#444" }}
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? "Hide" : "Show"} Password
              </button>
              <button type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
          {status?.success && <div className="success-message">{status.success}</div>}
          {status?.error && <div className="error-message">{status.error}</div>}
          <p><Link to="/login">Back to login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
