import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page3D, TiltCard } from "../components/Motion";
import { db, money, tripStatus } from "../db";
import type { User } from "../types";

export function DashboardPage({ user }: { user: User }) {
  const navigate = useNavigate();
  const trips = db.tripsByUser(user.user_id);
  const cities = db.cities();
  const spend = useMemo(() => {
    return trips.reduce((sum, trip) => {
      const sections = db.sectionsForTrip(trip.trip_id);
      return sum + sections.reduce((s, sec) => s + Number(sec.budget || 0), 0);
    }, 0);
  }, [trips]);
  const previous = trips.filter((t) => tripStatus(t) === "Completed");
  const upcoming = trips.filter((t) => tripStatus(t) !== "Completed");
  const [sort, setSort] = useState<"popularity" | "cost">("popularity");
  const regions = [...cities].sort((a, b) =>
    sort === "popularity" ? b.popularity - a.popularity : a.cost_index - b.cost_index,
  );

  return (
    <Page3D>
      <section className="hero-banner">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
          alt="Travel planning map and essentials"
        />
        <div className="overlay">
          <p className="muted">Welcome back, {user.first_name || user.username}</p>
          <h1>Where shall we go next?</h1>
          <p>Planned budget across your trips: {money(spend)}</p>
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "space-between", margin: "28px 0 12px" }}>
        <h2>Top regional selections</h2>
        <button className="chip" onClick={() => setSort(sort === "popularity" ? "cost" : "popularity")}>
          Sort by {sort === "popularity" ? "cost index" : "popularity"}
        </button>
      </div>
      <div className="row-scroll">
        {regions.slice(0, 5).map((city) => (
          <TiltCard key={city.city_id} onClick={() => navigate(`/search?q=${city.city_name}`)}>
            <img className="cover" src={city.image} alt={city.city_name} />
            <div className="body">
              <strong>{city.city_name}</strong>
              <div className="muted">
                {city.region} · score {city.popularity}
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

      <h2 style={{ marginTop: 28 }}>Upcoming & recent trips</h2>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: 12 }}>
        {(upcoming.length ? upcoming : trips).slice(0, 3).map((trip) => (
          <TiltCard key={trip.trip_id} className="trip-card" onClick={() => navigate(`/trips/${trip.trip_id}`)}>
            <img className="cover" src={trip.cover_photo} alt={trip.trip_name} />
            <div className="body">
              <strong>{trip.trip_name}</strong>
              <div className="muted">
                {trip.start_date} → {trip.end_date} · {tripStatus(trip)}
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

      <h2 style={{ marginTop: 28 }}>Previous trips</h2>
      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginTop: 12 }}>
        {(previous.length ? previous : trips.slice(-3)).map((trip) => (
          <TiltCard key={trip.trip_id} onClick={() => navigate(`/trips/${trip.trip_id}`)}>
            <img className="cover" src={trip.cover_photo} alt="" />
            <div className="body">
              <strong>{trip.trip_name}</strong>
              <div className="muted">{tripStatus(trip)}</div>
            </div>
          </TiltCard>
        ))}
      </div>

      <button className="fab" onClick={() => navigate("/trips/new")}>
        + Plan a trip
      </button>
    </Page3D>
  );
}
