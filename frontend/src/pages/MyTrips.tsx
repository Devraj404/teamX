import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page3D } from "../components/Motion";
import { api, type ApiTrip } from "../api";
import type { User } from "../types";

export function MyTripsPage({ user }: { user: User }) {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [error, setError] = useState("");
  const groups = ["Ongoing", "Upcoming", "Completed"] as const;

  useEffect(() => {
    api.trips().then(({ trips: nextTrips }) => setTrips(nextTrips)).catch((requestError) => {
      setError(requestError instanceof Error ? requestError.message : "Could not load trips.");
    });
  }, []);

  return (
    <Page3D>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>My trips</h1>
          <p className="muted">Ongoing, upcoming, and completed plans in one studio.</p>
        </div>
        <button className="btn" onClick={() => navigate("/trips/new")}>
          Plan new trip
        </button>
      </div>
      {error && <div className="alert">{error}</div>}
      {groups.map((group) => (
        <section key={group} style={{ marginTop: 28 }}>
          <h2>{group}</h2>
          <div className="grid" style={{ marginTop: 12 }}>
            {trips
              .filter((t) => t.status.toLowerCase() === group.toLowerCase())
              .map((trip) => {
                return (
                  <article key={trip.tripId} className="card list-card">
                    <img src={trip.coverPhoto || "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80"} alt="" />
                    <div>
                      <strong>Short overview of the trip · {trip.tripName}</strong>
                      <div className="muted">
                        {trip.startDate?.slice(0, 10) || "No start date"} – {trip.endDate?.slice(0, 10) || "No end date"} · {trip.sections.length} stops
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button className="chip" onClick={() => navigate(`/trips/${trip.tripId}`)}>
                        View
                      </button>
                      <button className="chip" onClick={() => navigate(`/trips/${trip.tripId}/build`)}>
                        Edit
                      </button>
                      <button className="chip" onClick={() => navigate(`/trips/${trip.tripId}/budget`)}>
                        Budget
                      </button>
                      <button
                        className="chip"
                        onClick={() => {
                          api.deleteTrip(trip.tripId)
                            .then(() => setTrips((current) => current.filter((item) => item.tripId !== trip.tripId)))
                            .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Could not delete trip."));
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            {trips.filter((t) => t.status.toLowerCase() === group.toLowerCase()).length === 0 && (
              <p className="muted">No {group.toLowerCase()} trips yet.</p>
            )}
          </div>
        </section>
      ))}
    </Page3D>
  );
}
