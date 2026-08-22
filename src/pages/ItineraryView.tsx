import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Page3D } from "../components/Motion";
import { db, money } from "../db";

export function ItineraryViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const trip = db.trip(Number(id));
  const [mode, setMode] = useState<"list" | "calendar">("list");
  const sections = trip ? db.sectionsForTrip(trip.trip_id) : [];
  const rows = useMemo(() => {
    return sections.flatMap((section) => {
      const acts = db.activitiesForSection(section.section_id);
      const city = section.city_id ? db.city(section.city_id) : null;
      if (!acts.length) {
        return [
          {
            day: section.start_date,
            city: city?.city_name || "Stop",
            name: section.description,
            expense: section.budget,
            id: `s-${section.section_id}`,
          },
        ];
      }
      return acts.map((a) => ({
        day: a.activity_date,
        city: city?.city_name || "Stop",
        name: a.activity_name,
        expense: a.expense,
        id: String(a.section_activity_id),
      }));
    });
  }, [sections]);

  if (!trip) return <Page3D>Trip not found.</Page3D>;

  return (
    <Page3D>
      <p className="muted">
        <Link to="/trips">{trip.trip_name}</Link> · selected place timeline
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h1>{trip.trip_name}</h1>
        <div>
          <button className="chip" onClick={() => setMode("list")}>
            List
          </button>
          <button className="chip" onClick={() => navigate(`/trips/${trip.trip_id}/calendar`)}>
            Calendar
          </button>
          <button className="chip" onClick={() => navigate(`/trips/${trip.trip_id}/budget`)}>
            Budget
          </button>
          <button className="chip" onClick={() => navigate(`/share/${trip.public_slug}`)}>
            Public link
          </button>
        </div>
      </div>
      <p className="muted">{trip.description}</p>
      <div className="timeline" style={{ marginTop: 24 }}>
        {rows.map((row, i) => (
          <div className="timeline-row" key={row.id}>
            <div className="day-mark">
              <span>Day {i + 1}</span>
              <span className="dot" />
              <span className="stem" />
            </div>
            <article className="card" style={{ padding: 16 }}>
              <div className="muted">{row.city} · {row.day}</div>
              <strong>Physical activity</strong>
              <p>{row.name}</p>
            </article>
            <article className="card" style={{ padding: 16 }}>
              <div className="muted">Expense</div>
              <strong>{money(row.expense)}</strong>
            </article>
          </div>
        ))}
      </div>
      {mode === "calendar" && <p className="muted">Open the full calendar view for drag-style editing.</p>}
    </Page3D>
  );
}
