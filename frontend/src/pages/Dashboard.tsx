import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [slide, setSlide] = useState(0);
  const featured = regions.slice(0, 5);
  const activeCity = featured[slide] || cities[0];

  useEffect(() => {
    if (featured.length < 2) return;
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % featured.length), 5000);
    return () => window.clearInterval(timer);
  }, [featured.length]);

  return (
    <Page3D>
      <section className="destination-carousel" aria-label="Featured destinations">
        <AnimatePresence mode="wait">
          <motion.div
            className="carousel-image"
            key={activeCity?.city_id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            role="img"
            aria-label={activeCity ? `${activeCity.city_name}, ${activeCity.country}` : "Featured destination"}
            style={{ backgroundImage: `url(${activeCity?.image || ""})` }}
          />
        </AnimatePresence>
        <div className="overlay">
          <p className="eyebrow">Featured destination</p>
          <h1>{activeCity?.city_name || "Plan your next escape"}</h1>
          <p>{activeCity?.country} · {activeCity?.region} · popularity score {activeCity?.popularity}</p>
          <button className="btn carousel-cta" onClick={() => activeCity && navigate(`/search?q=${activeCity.city_name}`)}>
            Explore {activeCity?.city_name}
          </button>
        </div>
        <div className="carousel-controls">
          {featured.map((city, index) => (
            <button
              key={city.city_id}
              className={`carousel-dot ${index === slide ? "active" : ""}`}
              onClick={() => setSlide(index)}
              aria-label={`Show ${city.city_name}`}
            />
          ))}
        </div>
      </section>

      <section className="home-stats" aria-label="Trip overview">
        <article><strong>{trips.length}</strong><span>saved trips</span></article>
        <article><strong>{upcoming.length}</strong><span>upcoming escapes</span></article>
        <article><strong>{money(spend)}</strong><span>planned budget</span></article>
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
