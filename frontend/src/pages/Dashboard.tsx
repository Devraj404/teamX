import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Page3D, TiltCard } from "../components/Motion";
import { api, type ApiCity, type ApiTrip } from "../api";
import { getCityPhoto, getTripCoverPhoto } from "../utils/images";
import type { User } from "../types";

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return dateStr.slice(0, 10);
}

export function DashboardPage({ user }: { user: User }) {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<"popularity" | "cost">("popularity");
  const [slide, setSlide] = useState(0);

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([api.trips(), api.cities()])
      .then(([{ trips: fetchedTrips }, { cities: fetchedCities }]) => {
        setTrips(fetchedTrips || []);
        setCities(fetchedCities || []);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Could not fetch dashboard data from server.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const spend = useMemo(() => {
    return trips.reduce((sum, trip) => {
      const sectionBudgetSum = (trip.sections || []).reduce(
        (s, sec) => s + Number(sec.budget || 0),
        0
      );
      return sum + sectionBudgetSum;
    }, 0);
  }, [trips]);

  const previous = useMemo(
    () => trips.filter((t) => t.status === "completed"),
    [trips]
  );
  const upcoming = useMemo(
    () => trips.filter((t) => t.status !== "completed"),
    [trips]
  );

  const sortedCities = useMemo(() => {
    return [...cities].sort((a, b) => {
      if (sort === "popularity") {
        return (b.popularity || 0) - (a.popularity || 0);
      }
      return Number(a.costIndex || 0) - Number(b.costIndex || 0);
    });
  }, [cities, sort]);

  const featured = useMemo(() => sortedCities.slice(0, 5), [sortedCities]);
  const activeCity = featured[slide] || cities[0];

  useEffect(() => {
    if (featured.length < 2) return;
    const timer = window.setInterval(
      () => setSlide((current) => (current + 1) % featured.length),
      5000
    );
    return () => window.clearInterval(timer);
  }, [featured.length]);

  if (loading) {
    return (
      <Page3D>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
          <div className="animate-spin" style={{ width: 40, height: 40, border: "4px solid rgba(255,255,255,0.1)", borderTopColor: "var(--primary, #3b82f6)", borderRadius: "50%" }} />
          <p className="muted">Loading your dashboard…</p>
        </div>
      </Page3D>
    );
  }

  if (error) {
    return (
      <Page3D>
        <div className="alert alert-error" style={{ margin: "40px auto", maxWidth: 600, padding: 24, textAlign: "center" }}>
          <h2>Dashboard Connection Error</h2>
          <p style={{ margin: "12px 0 20px" }}>{error}</p>
          <button className="btn" onClick={loadData}>
            Retry Connection
          </button>
        </div>
      </Page3D>
    );
  }

  return (
    <Page3D>
      {/* Featured Destination Carousel */}
      <section className="destination-carousel" aria-label="Featured destinations">
        <AnimatePresence mode="wait">
          <motion.div
            className="carousel-image"
            key={activeCity?.cityId || "fallback"}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            role="img"
            aria-label={activeCity ? `${activeCity.cityName}, ${activeCity.country}` : "Featured destination"}
            style={{ backgroundImage: `url(${getCityPhoto(activeCity?.cityName)})` }}
          />
        </AnimatePresence>
        <div className="overlay">
          <p className="eyebrow">Featured destination</p>
          <h1>{activeCity?.cityName || "Plan your next escape"}</h1>
          <p>
            {activeCity?.country} · {activeCity?.region}
            {activeCity?.popularity !== null && activeCity?.popularity !== undefined ? ` · popularity score ${activeCity.popularity}` : ""}
          </p>
          <button
            className="btn carousel-cta"
            onClick={() => activeCity && navigate(`/search?q=${encodeURIComponent(activeCity.cityName)}`)}
          >
            Explore {activeCity?.cityName || "Destinations"}
          </button>
        </div>
        {featured.length > 0 && (
          <div className="carousel-controls">
            {featured.map((city, index) => (
              <button
                key={city.cityId}
                className={`carousel-dot ${index === slide ? "active" : ""}`}
                onClick={() => setSlide(index)}
                aria-label={`Show ${city.cityName}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trip Overview Stats */}
      <section className="home-stats" aria-label="Trip overview">
        <article>
          <strong>{trips.length}</strong>
          <span>saved trips</span>
        </article>
        <article>
          <strong>{upcoming.length}</strong>
          <span>upcoming escapes</span>
        </article>
        <article>
          <strong>{formatMoney(spend)}</strong>
          <span>planned budget</span>
        </article>
      </section>

      {/* Top Regional Selections */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "28px 0 12px" }}>
        <h2>Top regional selections</h2>
        <button className="chip" onClick={() => setSort(sort === "popularity" ? "cost" : "popularity")}>
          Sort by {sort === "popularity" ? "cost index" : "popularity"}
        </button>
      </div>
      <div className="row-scroll">
        {sortedCities.slice(0, 6).map((city) => (
          <TiltCard key={city.cityId} onClick={() => navigate(`/search?q=${encodeURIComponent(city.cityName)}`)}>
            <img className="cover" src={getCityPhoto(city.cityName)} alt={city.cityName} />
            <div className="body">
              <strong>{city.cityName}</strong>
              <div className="muted">
                {city.region || city.country} {city.popularity ? `· score ${city.popularity}` : ""}
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

      {/* Upcoming & Recent Trips */}
      <h2 style={{ marginTop: 28 }}>Upcoming & recent trips</h2>
      {trips.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "36px 24px",
            textAlign: "center",
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            background: "rgba(255,255,255,0.03)",
            border: "1px dashed rgba(255,255,255,0.15)",
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 32 }}>✈️</div>
          <strong style={{ fontSize: "1.1rem" }}>No trips yet — plan your first one!</strong>
          <p className="muted" style={{ maxWidth: 420 }}>
            Start building your dream itinerary, adding destinations, and calculating trip budgets.
          </p>
          <button className="btn" onClick={() => navigate("/trips/new")} style={{ marginTop: 8 }}>
            + Plan a trip
          </button>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: 12 }}>
          {(upcoming.length ? upcoming : trips).slice(0, 3).map((trip) => {
            const firstCity = trip.sections?.[0]?.city?.cityName;
            return (
              <TiltCard key={trip.tripId} className="trip-card" onClick={() => navigate(`/trips/${trip.tripId}`)}>
                <img className="cover" src={getTripCoverPhoto(trip.coverPhoto, firstCity)} alt={trip.tripName} />
                <div className="body">
                  <strong>{trip.tripName}</strong>
                  <div className="muted">
                    {formatDate(trip.startDate)} {trip.endDate ? `→ ${formatDate(trip.endDate)}` : ""} · {trip.status}
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      )}

      {/* Previous Trips Section if user has completed trips */}
      {previous.length > 0 && (
        <>
          <h2 style={{ marginTop: 28 }}>Previous trips</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: 12 }}>
            {previous.slice(0, 3).map((trip) => {
              const firstCity = trip.sections?.[0]?.city?.cityName;
              return (
                <TiltCard key={trip.tripId} onClick={() => navigate(`/trips/${trip.tripId}`)}>
                  <img className="cover" src={getTripCoverPhoto(trip.coverPhoto, firstCity)} alt={trip.tripName} />
                  <div className="body">
                    <strong>{trip.tripName}</strong>
                    <div className="muted">{trip.status}</div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </>
      )}

      <button className="fab" onClick={() => navigate("/trips/new")} title="Plan a trip">
        + Plan a trip
      </button>
    </Page3D>
  );
}

