import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login/", form);
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);

      // Save username for dashboard top bar
      localStorage.setItem("username", form.username);

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="app-shell">
      {/* Background blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      {/* Card */}
      <div
        style={{
          maxWidth: "380px",
          margin: "120px auto",
          padding: "32px 28px",
          background: "rgba(255,255,255,0.95)",
          borderRadius: "24px",
          border: "1px solid rgba(226,232,240,0.9)",
          boxShadow: "0 24px 60px rgba(15,23,42,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "18px",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "999px",
              background:
                "linear-gradient(135deg, var(--primary), var(--accent))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "12px",
              color: "#fff",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            TM
          </div>

          <span
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "var(--text-main)",
            }}
          >
            Task Manager
          </span>
        </div>

        <h2 style={{ marginBottom: "8px", textAlign: "center" }}>Login</h2>

        {error && (
          <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="field">
            <label>Username</label>
            <input
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          {/* Password + Eye */}
          <div className="field" style={{ position: "relative" }}>
            <label>Password</label>

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              style={{ paddingRight: "42px" }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "36px",
                cursor: "pointer",
                fontSize: "14px",
                color: "#6b7280",
                userSelect: "none",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button className="btn-primary full-width" type="submit">
            Login
          </button>
        </form>

        <p
          style={{
            marginTop: "12px",
            textAlign: "center",
            fontSize: "14px",
            color: "var(--text-muted)",
          }}
        >
          Don’t have an account?{" "}
          <Link
            to="/register"
            style={{ color: "var(--accent)", fontWeight: "600" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
