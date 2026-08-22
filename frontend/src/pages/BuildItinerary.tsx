import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Page3D } from "../components/Motion";
import { db } from "../db";

const cityAdvice: Record<string, { days: number; season: string; budget: number }> = {
  "Mount Abu": { days: 3, season: "October to March", budget: 9000 },
  Saputara: { days: 2, season: "October to February", budget: 6500 },
  Goa: { days: 4, season: "November to February", budget: 18000 },
  Udaipur: { days: 3, season: "October to March", budget: 11000 },
  Jaipur: { days: 3, season: "October to March", budget: 10500 },
  Manali: { days: 4, season: "March to June", budget: 14000 },
};

const addDays = (date: string, days: number) => {
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
};

export function BuildItineraryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tripId = Number(id);
  const trip = db.trip(tripId);
  const cities = db.cities();
  const [version, setVersion] = useState(0);
  const [custom, setCustom] = useState({ sectionId: 0, name: "", cost: "", date: "" });
  const refresh = () => setVersion((n) => n + 1);
  const sections = useMemo(() => db.sectionsForTrip(tripId), [tripId, version]);

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
                  onChange={(e) => {
                    const city = db.city(Number(e.target.value));
                    if (!city) return;
                    const advice = cityAdvice[city.city_name] || { days: 2, season: "October to March", budget: 7000 };
                    const start = i === 0 ? trip.start_date : sections[i - 1]?.end_date || trip.start_date;
                    db.saveSection({
                      ...section,
                      city_id: city.city_id,
                      description: `${city.city_name} — ${advice.days} days recommended. Best time: ${advice.season}.`,
                      start_date: start,
                      end_date: addDays(start, advice.days - 1),
                      budget: advice.budget,
                    });
                    refresh();
                  }}
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
            {section.city_id && (
              <p className="planner-advice">
                Recommended stay: {cityAdvice[db.city(section.city_id)?.city_name || ""]?.days || 2} days · Best season: {cityAdvice[db.city(section.city_id)?.city_name || ""]?.season || "October to March"}
              </p>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                className="chip"
                onClick={() => setCustom({ sectionId: section.section_id, name: "", cost: "", date: section.start_date })}
              >
                Add personal activity
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
            {custom.sectionId === section.section_id && (
              <form
                className="personal-activity"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!custom.name.trim()) return;
                  db.saveSectionActivity({
                    section_id: section.section_id,
                    activity_id: null,
                    activity_date: custom.date || section.start_date,
                    activity_name: custom.name.trim(),
                    expense: Number(custom.cost) || 0,
                    category: "activities",
                  });
                  setCustom({ sectionId: 0, name: "", cost: "", date: "" });
                  refresh();
                }}
              >
                <input placeholder="e.g. Badminton or cricket" value={custom.name} onChange={(e) => setCustom({ ...custom, name: e.target.value })} />
                <input type="date" value={custom.date} onChange={(e) => setCustom({ ...custom, date: e.target.value })} />
                <input type="number" min="0" placeholder="Cost (₹)" value={custom.cost} onChange={(e) => setCustom({ ...custom, cost: e.target.value })} />
                <button className="btn" type="submit">Add activity</button>
              </form>
            )}
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
