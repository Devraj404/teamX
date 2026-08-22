import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type ApiTrip } from "../api";
import { Page3D } from "../components/Motion";

export function SharePage() {
  const { slug } = useParams();
  const [trip, setTrip] = useState<ApiTrip | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const tripId = Number(slug);
    if (!Number.isInteger(tripId) || tripId < 1) return setError("Itinerary not found");
    api.publicTrip(tripId).then(({ trip: nextTrip }) => setTrip(nextTrip)).catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Itinerary not found"));
  }, [slug]);

  if (error) return <Page3D><h1>Itinerary not found</h1><p className="muted">This public link does not match a public trip.</p><Link to="/login">Sign in to GlobeTrotter</Link></Page3D>;
  if (!trip) return <Page3D>Loading public itinerary...</Page3D>;
  return <Page3D>
    <p className="muted">Public itinerary</p><h1>{trip.tripName}</h1>
    <p className="muted">{trip.startDate?.slice(0, 10)} to {trip.endDate?.slice(0, 10)}</p><p>{trip.description}</p>
    <div className="share-actions"><button className="chip" onClick={() => navigator.clipboard?.writeText(window.location.href)}>Copy public link</button><a className="chip" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Take a look at ${trip.tripName}`)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer">Share</a></div>
    <div className="grid">{trip.sections.map((section, index) => <article key={section.sectionId} className="section-block"><strong>Section {index + 1} · {section.city?.cityName || "Stop"}</strong><p>{section.description}</p><div className="muted">{section.startDate?.slice(0, 10)} to {section.endDate?.slice(0, 10)}</div><ul>{(section.sectionActivities || []).map((activity) => <li key={activity.sectionActivityId}>{activity.activityDate?.slice(0, 10)}: {activity.activityName || "Activity"} · ₹{Number(activity.expense || 0).toFixed(2)}</li>)}</ul></article>)}</div>
  </Page3D>;
}
