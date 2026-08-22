import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Page3D } from "../components/Motion";
import { db } from "../db";

export function BuildItineraryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tripId = Number(id);
  const trip = db.trip(tripId);
  const cities = db.cities();
  const [, bump] = useState(0);
  const refresh = () => bump((n) => n + 1);
  const sections = useMemo(() => db.sectionsForTrip(tripId), [tripId, bump]);

  if (!trip) return <Page3D>Trip not found.</Page3D>;

  return (
    <Page3D>
      <p className="muted">
        <Link to="/trips">Trips</Link> / {trip.trip_name}
      </p>
      <h1>Build itinerary</h1>
      <p className="muted">Add cities as sections, set date ranges, and assign a section budget.</p>

      <div className="grid" style={{ marginTop: 20 }}>
        {sections.map((section, i) => (
          <article key={section.section_id} className="section-block">
            <strong>Section {i + 1}</strong>
            <label>
              All the necessary information about this section
              <textarea
                defaultValue={section.description}
                onBlur={(e) => db.saveSection({ ...section, description: e.target.value })}
              />
            </label>
            <div className="two">
              <label>
                City / stop
                <select
                  defaultValue={section.city_id || ""}
                  onChange={(e) =>
                    db.saveSection({ ...section, city_id: Number(e.target.value) || undefined })
                  }
                >
                  <option value="">Select a city</option>
                  {cities.map((c) => (
                    <option key={c.city_id} value={c.city_id}>
                      {c.city_name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Budget of this section
                <input
                  type="number"
                  defaultValue={section.budget}
                  onBlur={(e) => db.saveSection({ ...section, budget: Number(e.target.value) })}
                />
              </label>
            </div>
            <div className="two">
              <label>
                Date range start
                <input
                  type="date"
                  defaultValue={section.start_date}
                  onChange={(e) => db.saveSection({ ...section, start_date: e.target.value })}
                />
              </label>
              <label>
                Date range end
                <input
                  type="date"
                  defaultValue={section.end_date}
                  onChange={(e) => db.saveSection({ ...section, end_date: e.target.value })}
                />
              </label>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="chip" onClick={() => navigate(`/search?trip=${tripId}&section=${section.section_id}`)}>
                Assign activities
              </button>
              <button
                className="chip"
                onClick={() => {
                  const prev = sections[i - 1];
                  if (!prev) return;
                  db.saveSection({ ...section, section_order: prev.section_order });
                  db.saveSection({ ...prev, section_order: section.section_order });
                  refresh();
                }}
              >
                Move up
              </button>
              <button
                className="chip"
                onClick={() => {
                  db.deleteSection(section.section_id);
                  refresh();
                }}
              >
                Remove stop
              </button>
            </div>
            <ul className="muted">
              {db.activitiesForSection(section.section_id).map((a) => (
                <li key={a.section_activity_id}>
                  {a.activity_date}: {a.activity_name} · ${a.expense}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <button
        className="btn"
        style={{ marginTop: 18 }}
        onClick={() => {
          db.saveSection({
            trip_id: tripId,
            section_order: sections.length + 1,
            description: "New stop — add city, dates, and notes.",
            start_date: trip.end_date,
            end_date: trip.end_date,
            budget: 0,
          });
          refresh();
        }}
      >
        + Add another section
      </button>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="chip" onClick={() => navigate(`/trips/${tripId}`)}>
          Itinerary view
        </button>
        <button className="chip" onClick={() => navigate(`/trips/${tripId}/calendar`)}>
          Calendar
        </button>
      </div>
    </Page3D>
  );
}
