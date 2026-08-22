import { Link, useParams } from "react-router-dom";
import { Page3D } from "../components/Motion";
import { db, money } from "../db";

export function SharePage() {
  const { slug } = useParams();
  const trip = slug ? db.tripBySlug(slug) : undefined;
  const owner = trip ? db.getUser(trip.user_id) : undefined;
  const sections = trip ? db.sectionsForTrip(trip.trip_id) : [];

  if (!trip) {
    return (
      <Page3D>
        <h1>Itinerary not found</h1>
        <p className="muted">This public link does not match a saved trip.</p>
        <Link to="/login">Sign in to Globetrotter</Link>
      </Page3D>
    );
  }

  return (
    <Page3D>
      <p className="muted">Public itinerary</p>
      <h1>{trip.trip_name}</h1>
      <p className="muted">
        Shared by {owner?.first_name} {owner?.last_name} · {trip.start_date} → {trip.end_date}
      </p>
      <p>{trip.description}</p>
      <div className="share-actions">
        <button
          className="chip"
          onClick={() => navigator.clipboard?.writeText(window.location.href)}
        >
          Copy public link
        </button>
        <a
          className="chip"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Take a look at ${trip.trip_name}`)}&url=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noreferrer"
        >
          Share
        </a>
      </div>
      <img
        src={trip.cover_photo}
        alt=""
        style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 22, margin: "20px 0" }}
      />
      <div className="grid">
        {sections.map((section, i) => {
          const city = section.city_id ? db.city(section.city_id) : null;
          const acts = db.activitiesForSection(section.section_id);
          return (
            <article key={section.section_id} className="section-block">
              <strong>
                Section {i + 1}
                {city ? ` · ${city.city_name}` : ""}
              </strong>
              <p>{section.description}</p>
              <div className="muted">
                {section.start_date} to {section.end_date} · budget {money(section.budget)}
              </div>
              <ul>
                {acts.map((a) => (
                  <li key={a.section_activity_id}>
                    {a.activity_date}: {a.activity_name} · {money(a.expense)}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
      <p style={{ marginTop: 24 }}><Link to="/register">Copy this plan by creating a Globetrotter account</Link></p>
    </Page3D>
  );
}
