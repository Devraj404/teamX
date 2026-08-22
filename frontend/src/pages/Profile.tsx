import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page3D, TiltCard } from "../components/Motion";
import { db, tripStatus } from "../db";
import type { User } from "../types";

export function ProfilePage({ user, onChange }: { user: User; onChange: () => void }) {
  const navigate = useNavigate();
  const trips = db.tripsByUser(user.user_id);
  const planned = trips.filter((t) => tripStatus(t) !== "Completed");
  const previous = trips.filter((t) => tripStatus(t) === "Completed");
  const [lang, setLang] = useState(localStorage.getItem("gt.lang") || "English");

  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    db.updateUser({
      ...user,
      first_name: String(f.get("first_name")),
      last_name: String(f.get("last_name")),
      email: String(f.get("email")),
      phone_number: String(f.get("phone_number")),
      city: String(f.get("city")),
      country: String(f.get("country")),
      additional_information: String(f.get("additional_information")),
    });
    localStorage.setItem("gt.lang", lang);
    onChange();
  };

  return (
    <Page3D>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <img className="avatar" src={user.photo} alt="" style={{ width: 92, height: 92 }} />
        <div>
          <h1>User details</h1>
          <p className="muted">
            {user.first_name} {user.last_name} · {user.email}
          </p>
        </div>
      </div>
      <form className="form wide" style={{ marginTop: 24 }} onSubmit={save}>
        <div className="two">
          <label>First name<input name="first_name" defaultValue={user.first_name} /></label>
          <label>Last name<input name="last_name" defaultValue={user.last_name} /></label>
          <label>Email<input name="email" defaultValue={user.email} /></label>
          <label>Phone<input name="phone_number" defaultValue={user.phone_number} /></label>
          <label>City<input name="city" defaultValue={user.city} /></label>
          <label>Country<input name="country" defaultValue={user.country} /></label>
        </div>
        <label>
          Language preference
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option>English</option>
            <option>Hindi</option>
            <option>French</option>
            <option>Japanese</option>
          </select>
        </label>
        <label>
          Additional information
          <textarea name="additional_information" defaultValue={user.additional_information} />
        </label>
        <button className="btn" type="submit">Save profile</button>
      </form>

      <h2 style={{ marginTop: 32 }}>Preplanned trips</h2>
      <div className="row-scroll">
        {planned.map((t) => (
          <TiltCard key={t.trip_id}>
            <img className="cover" src={t.cover_photo} alt="" />
            <div className="body">
              <strong>{t.trip_name}</strong>
              <button className="chip" onClick={() => navigate(`/trips/${t.trip_id}`)}>View</button>
            </div>
          </TiltCard>
        ))}
      </div>
      <h2 style={{ marginTop: 24 }}>Previous trips</h2>
      <div className="row-scroll">
        {(previous.length ? previous : trips).map((t) => (
          <TiltCard key={t.trip_id}>
            <img className="cover" src={t.cover_photo} alt="" />
            <div className="body">
              <strong>{t.trip_name}</strong>
              <button className="chip" onClick={() => navigate(`/trips/${t.trip_id}`)}>View</button>
            </div>
          </TiltCard>
        ))}
      </div>
      <h2 style={{ marginTop: 24 }}>Saved destinations</h2>
      <div className="row-scroll">
        {db.cities().slice(0, 6).map((c) => (
          <TiltCard key={c.city_id} onClick={() => navigate(`/search?q=${c.city_name}`)}>
            <img className="cover" src={c.image} alt="" />
            <div className="body">{c.city_name}</div>
          </TiltCard>
        ))}
      </div>
      <button
        className="chip"
        style={{ marginTop: 24 }}
        onClick={() => {
          if (confirm("Delete this account from the local demo database?")) {
            db.deleteUser(user.user_id);
            db.logout();
            navigate("/register");
          }
        }}
      >
        Delete account
      </button>
    </Page3D>
  );
}
