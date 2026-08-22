import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page3D, TiltCard } from "../components/Motion";
import { api, type ApiActivity, type ApiCity } from "../api";
import type { User } from "../types";

export function CreateTripPage({ user }: { user: User }) {
  const navigate = useNavigate();
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [cover, setCover] = useState("");
  const [place, setPlace] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<ApiActivity[]>([]);

  useEffect(() => {
    Promise.all([api.cities(), api.activities("?maxCost=10000")]).then(([cityResponse, activityResponse]) => {
      setCities(cityResponse.cities);
      setSuggestions(activityResponse.activities.slice(0, 6));
      if (cityResponse.cities[0]) setPlace(String(cityResponse.cities[0].cityId));
    }).catch((requestError) => {
      setError(requestError instanceof Error ? requestError.message : "Could not load cities.");
    });
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      const { trip } = await api.createTrip({
        tripName: String(f.get("trip_name") || "Untitled trip"),
        description: String(f.get("description") || ""),
        startDate: String(f.get("start_date") || ""),
        endDate: String(f.get("end_date") || ""),
        coverPhoto: cover || null,
      });
      const city = cities.find((item) => item.cityId === Number(place));
      if (city) {
        await api.createSection(trip.tripId, {
          cityId: city.cityId,
          sectionOrder: 1,
          description: `${city.cityName} - first stop.`,
          startDate: trip.startDate,
          endDate: trip.endDate,
          budget: 0,
        });
      }
      navigate(`/trips/${trip.tripId}/build`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not create trip.");
    }
  };

  return (
    <Page3D>
      <section className="create-trip-page">
      <div className="create-trip-heading">
        <p className="eyebrow">Step 1 of 2</p>
        <h1>Create a new trip</h1>
        <p className="muted">Name the journey, pick a first place, and set the window of travel.</p>
      </div>
      <form className="form trip-form" style={{ marginTop: 24 }} onSubmit={onSubmit}>
        <label className="full-span">
          Trip’s name
          <input name="trip_name" required placeholder="Autumn in three cities" />
        </label>
        <label className="full-span">
          Select a place
          <select name="place" value={place} onChange={(e) => {
            setPlace(e.target.value);
            setCover("");
          }}>
            {cities.map((c) => (
              <option key={c.cityId} value={c.cityId}>
                {c.cityName}, {c.country}
              </option>
            ))}
          </select>
        </label>
        {error && <div className="alert full-span">{error}</div>}
        <div className="two full-span">
          <label>
            Start date
            <input name="start_date" type="date" required />
          </label>
          <label>
            End date
            <input name="end_date" type="date" required />
          </label>
        </div>
        <label className="full-span">
          Trip description
          <textarea name="description" placeholder="Pace, companions, must-sees…" />
        </label>
        <label className="full-span">
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
        {cover && <img className="trip-cover-preview full-span" src={cover} alt="Selected trip cover" />}
        <button className="btn full-span" type="submit">
          Save trip & build itinerary
        </button>
      </form>

      <h2 className="suggestions-title">Suggestions for places to visit / activities</h2>
      <div className="grid suggestion-grid">
        {suggestions.map((a) => (
          <TiltCard key={a.activityId} onClick={() => navigate(`/search?tab=activities&q=${encodeURIComponent(a.activityName)}`)}>
            <img className="cover" src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80" alt="" />
            <div className="body">
              <strong>{a.activityName}</strong>
              <div className="muted">{a.type} · {a.city?.cityName || ""}</div>
            </div>
          </TiltCard>
        ))}
      </div>
      </section>
    </Page3D>
  );
}
