import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register/", form);
      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError("Username or Email already exists");
    }
  };

  return (
    <div className="app-shell">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

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

        <h2 style={{ textAlign: "center", marginBottom: "8px" }}>Register</h2>

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}
        {success && (
          <p style={{ color: "green", textAlign: "center" }}>{success}</p>
        )}

        <form onSubmit={handleSubmit}>
          {/* USERNAME */}
          <div className="field">
            <label>Username</label>
            <input
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}
          <div className="field">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* PASSWORD WITH EYE ICON */}
          <div className="field" style={{ position: "relative" }}>
            <label>Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              style={{ paddingRight: "42px" }}
            />

            {/* Eye Icon */}
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
            Create Account
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
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "var(--accent)", fontWeight: "600" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
