import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page3D, TiltCard } from "../components/Motion";
import { db } from "../db";
import type { User } from "../types";

export function CreateTripPage({ user }: { user: User }) {
  const navigate = useNavigate();
  const cities = db.cities();
  const [cover, setCover] = useState(cities[0]?.image || "");
  const [place, setPlace] = useState(String(cities[0]?.city_id || ""));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const trip = db.saveTrip({
      user_id: user.user_id,
      trip_name: String(f.get("trip_name") || "Untitled trip"),
      description: String(f.get("description") || ""),
      start_date: String(f.get("start_date") || ""),
      end_date: String(f.get("end_date") || ""),
      cover_photo: cover,
    });
    const city = db.city(Number(place));
    if (city) {
      db.saveSection({
        trip_id: trip.trip_id,
        section_order: 1,
        description: `${city.city_name} — first stop.`,
        start_date: trip.start_date,
        end_date: trip.end_date,
        budget: 0,
        city_id: city.city_id,
      });
    }
    navigate(`/trips/${trip.trip_id}/build`);
  };

  return (
    <Page3D>
      <h1>Create a new trip</h1>
      <p className="muted">Name the journey, pick a first place, and set the window of travel.</p>
      <form className="form trip-form" style={{ marginTop: 24 }} onSubmit={onSubmit}>
        <label>
          Trip’s name
          <input name="trip_name" required placeholder="Autumn in three cities" />
        </label>
        <label>
          Select a place
          <select name="place" value={place} onChange={(e) => {
            setPlace(e.target.value);
            const city = db.city(Number(e.target.value));
            if (city) setCover(city.image);
          }}>
            {cities.map((c) => (
              <option key={c.city_id} value={c.city_id}>
                {c.city_name}, {c.country}
              </option>
            ))}
          </select>
        </label>
        <div className="two">
          <label>
            Start date
            <input name="start_date" type="date" required />
          </label>
          <label>
            End date
            <input name="end_date" type="date" required />
          </label>
        </div>
        <label>
          Trip description
          <textarea name="description" placeholder="Pace, companions, must-sees…" />
        </label>
        <label>
          Cover photo (optional)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setCover(String(reader.result));
              reader.readAsDataURL(file);
            }}
          />
        </label>
        {cover && <img className="trip-cover-preview" src={cover} alt="Selected trip cover" />}
        <button className="btn" type="submit">
          Save trip & build itinerary
        </button>
      </form>

      <h2 style={{ marginTop: 36 }}>Suggestions for places to visit / activities</h2>
      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginTop: 12 }}>
        {db.activities().slice(0, 6).map((a) => (
          <TiltCard key={a.activity_id} onClick={() => navigate(`/search?q=${encodeURIComponent(a.activity_name)}`)}>
            <img className="cover" src={a.image} alt="" />
            <div className="body">
              <strong>{a.activity_name}</strong>
              <div className="muted">{a.type} · {db.city(a.city_id)?.city_name}</div>
            </div>
          </TiltCard>
        ))}
      </div>
    </Page3D>
  );
}
