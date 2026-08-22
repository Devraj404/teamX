import { useNavigate } from "react-router-dom";
import { Page3D } from "../components/Motion";
import { db, dayCount, tripStatus } from "../db";
import type { User } from "../types";

export function MyTripsPage({ user }: { user: User }) {
  const navigate = useNavigate();
  const trips = db.tripsByUser(user.user_id);
  const groups = ["Ongoing", "Upcoming", "Completed"] as const;

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
      {groups.map((group) => (
        <section key={group} style={{ marginTop: 28 }}>
          <h2>{group}</h2>
          <div className="grid" style={{ marginTop: 12 }}>
            {trips
              .filter((t) => tripStatus(t) === group)
              .map((trip) => {
                const sections = db.sectionsForTrip(trip.trip_id);
                return (
                  <article key={trip.trip_id} className="card list-card">
                    <img src={trip.cover_photo} alt="" />
                    <div>
                      <strong>Short overview of the trip · {trip.trip_name}</strong>
                      <div className="muted">
                        {trip.start_date} – {trip.end_date} · {sections.length} stops ·{" "}
                        {dayCount(trip.start_date, trip.end_date)} days
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button className="chip" onClick={() => navigate(`/trips/${trip.trip_id}`)}>
                        View
                      </button>
                      <button className="chip" onClick={() => navigate(`/trips/${trip.trip_id}/build`)}>
                        Edit
                      </button>
                      <button className="chip" onClick={() => navigate(`/trips/${trip.trip_id}/budget`)}>
                        Budget
                      </button>
                      <button
                        className="chip"
                        onClick={() => {
                          db.deleteTrip(trip.trip_id);
                          navigate(0);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            {trips.filter((t) => tripStatus(t) === group).length === 0 && (
              <p className="muted">No {group.toLowerCase()} trips yet.</p>
            )}
          </div>
        </section>
      ))}
    </Page3D>
  );
}
