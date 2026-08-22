import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Page3D } from "../components/Motion";
import { db } from "../db";
import type { User } from "../types";

export function CalendarPage({ user }: { user: User }) {
  const { id } = useParams();
  const trips = id ? [db.trip(Number(id))!].filter(Boolean) : db.tripsByUser(user.user_id);
  const [cursor, setCursor] = useState(new Date("2026-09-01"));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: startPad + daysInMonth }, (_, i) =>
    i < startPad ? null : i - startPad + 1,
  );

  const bars = useMemo(() => {
    return trips.flatMap((trip) =>
      db.sectionsForTrip(trip.trip_id).map((section) => ({
        label: `${trip.trip_name} · ${db.city(section.city_id || 0)?.city_name || "Stop"}`,
        start: section.start_date,
        end: section.end_date,
      })),
    );
  }, [trips]);

  return (
    <Page3D>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Calendar</h1>
        <div>
          <button className="chip" onClick={() => setCursor(new Date(year, month - 1, 1))}>Prev</button>
          <button className="chip" onClick={() => setCursor(new Date(year, month + 1, 1))}>Next</button>
        </div>
      </div>
      <p className="muted">
        {cursor.toLocaleString("en", { month: "long", year: "numeric" })} — trip sections as colored bars.
      </p>
      <div className="calendar" style={{ marginTop: 16 }}>
        <div className="cal-grid" style={{ marginBottom: 8, color: "var(--muted)" }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="cal-grid">
          {cells.map((day, i) => {
            const iso = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
            const hits = bars.filter((b) => iso && iso >= b.start && iso <= b.end);
            return (
              <div className="cal-cell" key={i}>
                {day}
                {hits.map((h) => (
                  <div className="bar" key={h.label + iso}>
                    {h.label}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Page3D>
  );
}
