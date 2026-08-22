import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, type ApiCity, type ApiSection, type ApiTrip } from "../api";
import { Page3D } from "../components/Motion";

export function BuildItineraryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tripId = Number(id);
  const [trip, setTrip] = useState<ApiTrip | null>(null);
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [sections, setSections] = useState<ApiSection[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.trip(tripId), api.cities()])
      .then(([tripResponse, cityResponse]) => {
        setTrip(tripResponse.trip);
        setSections(tripResponse.trip.sections || []);
        setCities(cityResponse.cities);
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Could not load itinerary."));
  }, [tripId]);

  const updateSection = async (section: ApiSection, payload: Record<string, unknown>) => {
    try {
      const response = await api.updateSection(tripId, section.sectionId, payload);
      setSections((current) => current.map((item) => item.sectionId === section.sectionId ? response.section : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update stop.");
    }
  };

  if (error && !trip) return <Page3D>{error}</Page3D>;
  if (!trip) return <Page3D>Loading itinerary...</Page3D>;

  return (
    <Page3D>
      <p className="muted"><Link to="/trips">Trips</Link> / {trip.tripName}</p>
      <h1>Build itinerary</h1>
      <p className="muted">Add cities as sections, set date ranges, and assign a section budget.</p>
      {error && <div className="alert">{error}</div>}
      <div className="grid" style={{ marginTop: 20 }}>
        {sections.map((section, index) => (
          <article key={section.sectionId} className="section-block">
            <strong>Section {index + 1}</strong>
            <label>
              City / stop
              <select value={section.cityId} onChange={(event) => updateSection(section, { cityId: Number(event.target.value) })}>
                {cities.map((city) => <option key={city.cityId} value={city.cityId}>{city.cityName}, {city.country || ""}</option>)}
              </select>
            </label>
            <label>
              Section description
              <textarea defaultValue={section.description || ""} onBlur={(event) => updateSection(section, { description: event.target.value })} />
            </label>
            <div className="two">
              <label>Start date<input type="date" defaultValue={section.startDate?.slice(0, 10) || ""} onChange={(event) => updateSection(section, { startDate: event.target.value })} /></label>
              <label>End date<input type="date" defaultValue={section.endDate?.slice(0, 10) || ""} onChange={(event) => updateSection(section, { endDate: event.target.value })} /></label>
            </div>
            <label>Section budget<input type="number" min="0" defaultValue={Number(section.budget || 0)} onBlur={(event) => updateSection(section, { budget: Number(event.target.value) })} /></label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="chip" onClick={() => navigate(`/search?tab=activities&trip=${tripId}&section=${section.sectionId}`)}>Assign activities</button>
              <button className="chip" onClick={() => api.deleteSection(tripId, section.sectionId).then(() => setSections((current) => current.filter((item) => item.sectionId !== section.sectionId))).catch(() => setError("Could not remove stop."))}>Remove stop</button>
            </div>
            <ul className="muted">{(section.sectionActivities || []).map((activity) => <li key={activity.sectionActivityId}>{activity.activityDate?.slice(0, 10) || ""}: {activity.activityName || "Activity"} · ₹{Number(activity.expense || 0).toFixed(2)}</li>)}</ul>
          </article>
        ))}
      </div>
      <button className="btn" style={{ marginTop: 18 }} onClick={async () => {
        const city = cities[0];
        if (!city) return setError("No cities are available.");
        try {
          const response = await api.createSection(tripId, { cityId: city.cityId, sectionOrder: sections.length + 1, startDate: trip.startDate, endDate: trip.endDate, budget: 0 });
          setSections((current) => [...current, response.section as ApiSection]);
        } catch (requestError) {
          setError(requestError instanceof Error ? requestError.message : "Could not add stop.");
        }
      }}>+ Add another section</button>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}><button className="chip" onClick={() => navigate(`/trips/${tripId}`)}>Itinerary view</button><button className="chip" onClick={() => navigate(`/trips/${tripId}/budget`)}>Budget</button></div>
    </Page3D>
  );
}
