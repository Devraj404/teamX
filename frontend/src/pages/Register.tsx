import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe } from "../components/Globe";
import { db } from "../db";

export function RegisterPage() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const username = String(f.get("username") || "").trim();
    const password = String(f.get("password") || "");
    const email = String(f.get("email") || "");
    if (!username || !password || !email) {
      setError("Username, password, and email are required.");
      return;
    }
    if (db.getUserByUsername(username)) {
      setError("That username is already taken.");
      return;
    }
    db.register({
      username,
      password,
      photo:
        photo ||
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=400&q=80",
      first_name: String(f.get("first_name") || ""),
      last_name: String(f.get("last_name") || ""),
      email,
      phone_number: String(f.get("phone_number") || ""),
      city: String(f.get("city") || ""),
      country: String(f.get("country") || ""),
      additional_information: String(f.get("additional_information") || ""),
    });
    navigate("/");
  };

  return (
    <div className="auth-wrap">
      <div className="auth-visual">
        <Globe />
      </div>
      <div className="auth-panel">
        <form className="form wide" onSubmit={onSubmit}>
          <label className="photo-orb" style={{ cursor: "pointer" }}>
            {photo ? <img src={photo} alt="" /> : "Photo"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setPhoto(String(reader.result));
                reader.readAsDataURL(file);
              }}
            />
          </label>
          <h2>Register traveler</h2>
          <div className="two">
            <label>
              First name
              <input name="first_name" />
            </label>
            <label>
              Last name
              <input name="last_name" />
            </label>
            <label>
              Email address
              <input name="email" type="email" />
            </label>
            <label>
              Phone number
              <input name="phone_number" />
            </label>
            <label>
              City
              <input name="city" />
            </label>
            <label>
              Country
              <input name="country" />
            </label>
            <label>
              Username
              <input name="username" />
            </label>
            <label>
              Password
              <input name="password" type="password" />
            </label>
          </div>
          <label>
            Additional information
            <textarea name="additional_information" placeholder="Languages, pace, accessibility notes…" />
          </label>
          {error && <div className="alert">{error}</div>}
          <button className="btn" type="submit">
            Register user
          </button>
          <Link to="/login">Already have an account</Link>
        </form>
      </div>
    </div>
  );
}
