import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./apiConfig";
import "./Auth.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token") || "";
    setToken(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setStatus({ error: "Missing token" });
    if (!password || password.length < 6) return setStatus({ error: "Password must be at least 6 characters" });
    if (password !== confirm) return setStatus({ error: "Passwords do not match" });

    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ error: data.message || "Failed to reset password" });
      } else {
        alert(data.message || "Password reset successful");
        navigate("/login");
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
          <h2>Reset Password</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <input type="password" placeholder="New password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save new password"}</button>
          </form>
          {status?.error && <div className="error-message">{status.error}</div>}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
