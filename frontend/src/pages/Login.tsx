import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe } from "../components/Globe";
import { db } from "../db";
import { api, saveToken } from "../api";

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = String(form.get("username") || "").trim();
    const password = String(form.get("password") || "");
    if (!username || !password) {
      setError("Enter both username and password.");
      return;
    }
    const remember = form.get("remember") === "on";
    try {
      const { token } = await api.login(username, password);
      saveToken(token);
    } catch {
      setError("Those credentials do not match an account.");
      return;
    }
    navigate("/");
  };

  return (
    <div className="auth-wrap">
      <div className="auth-visual">
        <Globe className="auth-globe" />
        <div className="auth-copy">
          <h1>Dream, design, and go.</h1>
          <p className="muted">A quiet studio for multi-city travel — itineraries, budgets, and shared plans.</p>
        </div>
      </div>
      <div className="auth-panel">
        <form className="form" onSubmit={onSubmit}>
          <div className="photo-orb brand-orb" aria-label="GlobeTrotter">
            <Globe />
          </div>
          <h2>Welcome back</h2>
          <p className="muted">Username and password to open your trips.</p>
          <label>
            Email or username
            <input
              name="username"
              autoComplete="username"
              defaultValue=""
              placeholder="aanya or aanya@example.com"
            />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" placeholder="travel123" />
          </label>
          {error && <div className="alert">{error}</div>}
          <label className="remember-control">
            <input name="remember" type="checkbox" />
            <span>Remember me on this device</span>
          </label>
          <button className="btn" type="submit">
            Login
          </button>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Link to="/forgot">Forgot password</Link>
            <Link to="/register">Create account</Link>
          </div>
          <p className="muted" style={{ fontSize: 13 }}>
            Demo traveler: aanya / travel123 · Admin: admin / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
