import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api, type ApiTrip } from "../api";
import { Page3D } from "../components/Motion";
import type { User } from "../types";

export function CalendarPage({ user: _user }: { user: User }) {
  const { id } = useParams();
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [cursor, setCursor] = useState(new Date("2026-09-01"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const load = id
      ? api.trip(Number(id)).then(({ trip }) => setTrips([trip]))
      : api.trips().then(({ trips: nextTrips }) => setTrips(nextTrips));

    load
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : "Could not load calendar data.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const startingDayOfWeek = first.getDay();

  const cells = Array.from({ length: startingDayOfWeek + totalDays }, (_, index) =>
    index < startingDayOfWeek ? null : index - startingDayOfWeek + 1
  );

  const bars = useMemo(() => {
    return trips.flatMap((trip) =>
      (trip.sections || []).map((section) => ({
        id: `trip-${trip.tripId}-sec-${section.sectionId}`,
        label: `${trip.tripName} · ${section.city?.cityName || "Stop"}`,
        start: section.startDate ? section.startDate.slice(0, 10) : trip.startDate ? trip.startDate.slice(0, 10) : "",
        end: section.endDate ? section.endDate.slice(0, 10) : trip.endDate ? trip.endDate.slice(0, 10) : "",
      }))
    );
  }, [trips]);

  if (error) {
    return (
      <Page3D>
        <div className="alert alert-error" style={{ margin: "24px 0" }}>{error}</div>
      </Page3D>
    );
  }

  return (
    <Page3D>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>Calendar</h1>
          <p className="muted">{cursor.toLocaleString("en-US", { month: "long", year: "numeric" })} — trip sections mapped across dates.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="chip" onClick={() => setCursor(new Date(year, month - 1, 1))}>
            ← Prev
          </button>
          <button className="chip" onClick={() => setCursor(new Date("2026-09-01"))}>
            September 2026
          </button>
          <button className="chip" onClick={() => setCursor(new Date(year, month + 1, 1))}>
            Next →
          </button>
        </div>
      </div>

      {loading ? (
        <p className="muted" style={{ marginTop: 24 }}>Loading calendar events…</p>
      ) : (
        <div className="calendar" style={{ marginTop: 20 }}>
          <div className="cal-grid" style={{ marginBottom: 8, color: "var(--muted)", fontWeight: 600 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} style={{ textAlign: "center", padding: "4px 0" }}>{day}</div>
            ))}
          </div>
          <div className="cal-grid">
            {cells.map((day, index) => {
              const iso = day
                ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : "";

              const hits = bars.filter(
                (bar) => iso && bar.start && bar.end && iso >= bar.start && iso <= bar.end
              );

              return (
                <div className="cal-cell" key={index} style={{ minHeight: 90, padding: 8, background: day ? "rgba(255,255,255,0.02)" : "transparent", borderRadius: 8 }}>
                  {day && <strong style={{ fontSize: "0.85rem", opacity: 0.7 }}>{day}</strong>}
                  <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                    {hits.map((hit) => (
                      <div
                        key={hit.id + iso}
                        className="bar trip-cover-bar"
                        style={{
                          fontSize: "0.75rem",
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: "var(--primary, #3b82f6)",
                          color: "#fff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={hit.label}
                      >
                        {hit.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Page3D>
  );
}
