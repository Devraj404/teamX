import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page3D, TiltCard } from "../components/Motion";
import { api, type ApiTrip } from "../api";
import type { User } from "../types";

export function ProfilePage({ user, onChange }: { user: User; onChange: () => void }) {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [cities, setCities] = useState<{ cityId: number; cityName: string; country: string | null }[]>([]);
  const [error, setError] = useState("");
  const planned = trips.filter((t) => t.status !== "completed");
  const previous = trips.filter((t) => t.status === "completed");
  const [lang, setLang] = useState(localStorage.getItem("gt.lang") || "English");

  useEffect(() => {
    Promise.all([api.trips(), api.cities()]).then(([tripResponse, cityResponse]) => {
      setTrips(tripResponse.trips);
      setCities(cityResponse.cities);
    }).catch(() => setError("Could not load profile data."));
  }, []);

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await api.updateMe({ firstName: String(f.get("first_name") || ""), lastName: String(f.get("last_name") || ""), email: String(f.get("email") || ""), phoneNumber: String(f.get("phone_number") || ""), city: String(f.get("city") || ""), country: String(f.get("country") || ""), additionalInformation: String(f.get("additional_information") || "") });
      localStorage.setItem("gt.lang", lang);
      onChange();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update profile.");
    }
  };

  return (
    <Page3D>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <div className="avatar avatar-initial profile-initial" aria-label="Profile initial">
          {(user.first_name || user.username).slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h1>User details</h1>
          <p className="muted">
            {user.first_name} {user.last_name} · {user.email}
          </p>
        </div>
      </div>
      <form className="form wide" style={{ marginTop: 24 }} onSubmit={save}>
        {error && <div className="alert">{error}</div>}
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
          <TiltCard key={t.tripId}>
            <img className="cover" src={t.coverPhoto || ""} alt="" />
            <div className="body">
              <strong>{t.tripName}</strong>
              <button className="chip" onClick={() => navigate(`/trips/${t.tripId}`)}>View</button>
            </div>
          </TiltCard>
        ))}
      </div>
      <h2 style={{ marginTop: 24 }}>Previous trips</h2>
      <div className="row-scroll">
        {(previous.length ? previous : trips).map((t) => (
          <TiltCard key={t.tripId}>
            <img className="cover" src={t.coverPhoto || ""} alt="" />
            <div className="body">
              <strong>{t.tripName}</strong>
              <button className="chip" onClick={() => navigate(`/trips/${t.tripId}`)}>View</button>
            </div>
          </TiltCard>
        ))}
      </div>
      <h2 style={{ marginTop: 24 }}>Saved destinations</h2>
      <div className="row-scroll">
        {cities.slice(0, 6).map((c) => (
          <TiltCard key={c.cityId} onClick={() => navigate(`/search?q=${c.cityName}`)}>
            <div className="body">{c.cityName}</div>
          </TiltCard>
        ))}
      </div>
      <button
        className="chip"
        style={{ marginTop: 24 }}
        onClick={() => {
          if (confirm("Delete this account?")) api.deleteMe().then(() => { api.logout(); navigate("/register"); }).catch(() => setError("Could not delete account."));
        }}
      >
        Delete account
      </button>
    </Page3D>
  );
}
