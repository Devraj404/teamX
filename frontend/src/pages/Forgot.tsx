import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

export function ForgotPage() {
  const [msg, setMsg] = useState("");
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "").trim();
    if (email) {
      setMsg(`If an account exists for ${email}, a password reset link has been requested.`);
    }
  };
  return (
    <div className="auth-panel" style={{ minHeight: "100vh" }}>
      <form className="form" onSubmit={onSubmit}>
        <h2>Forgot password</h2>
        <p className="muted">Enter the email on your GlobeTrotter account.</p>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        {msg && <div className="alert">{msg}</div>}
        <button className="btn" type="submit">
          Send reset
        </button>
        <Link to="/login">Back to login</Link>
      </form>
    </div>
  );
}
