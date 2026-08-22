import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../db";

export function ForgotPage() {
  const [msg, setMsg] = useState("");
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "");
    const found = db.all().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    setMsg(
      found
        ? `A reset note would be sent to ${found.email}. For this demo, sign in with your existing password.`
        : "No account uses that email.",
    );
  };
  return (
    <div className="auth-panel" style={{ minHeight: "100vh" }}>
      <form className="form" onSubmit={onSubmit}>
        <h2>Forgot password</h2>
        <p className="muted">Enter the email on your Globetrotter account.</p>
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
