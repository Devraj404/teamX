import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, type ApiTrip } from "../api";
import { Page3D } from "../components/Motion";

export function ItineraryViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<ApiTrip | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.trip(Number(id))
      .then(({ trip: nextTrip }) => setTrip(nextTrip))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Could not load trip."));
  }, [id]);

  const rows = useMemo(() => trip?.sections.flatMap((section) => {
    if (section.sectionActivities?.length) {
      return section.sectionActivities.map((activity) => ({
        id: String(activity.sectionActivityId),
        day: activity.activityDate,
        city: section.city?.cityName || "Stop",
        name: activity.activityName || "Activity",
        expense: Number(activity.expense || 0),
      }));
    }
    return [{
      id: `section-${section.sectionId}`,
      day: section.startDate,
      city: section.city?.cityName || "Stop",
      name: section.description || "Travel stop",
      expense: Number(section.budget || 0),
    }];
  }) || [], [trip]);

  if (error) return <Page3D>{error}</Page3D>;
  if (!trip) return <Page3D>Loading trip...</Page3D>;

  return <Page3D>
    <p className="muted"><Link to="/trips">Trips</Link> / {trip.tripName}</p>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <h1>{trip.tripName}</h1>
      <div>
        <button className="chip" onClick={() => navigate(`/trips/${trip.tripId}/build`)}>Edit itinerary</button>
        <button className="chip" onClick={() => navigate(`/trips/${trip.tripId}/budget`)}>Budget</button>
      </div>
    </div>
    <p className="muted">{trip.startDate?.slice(0, 10)} → {trip.endDate?.slice(0, 10)}</p>
    <div className="timeline" style={{ marginTop: 24 }}>
      {rows.map((row, index) => <div className="timeline-row" key={row.id}>
        <div className="day-mark"><span>Day {index + 1}</span><span className="dot" /><span className="stem" /></div>
        <article className="card" style={{ padding: 16 }}><div className="muted">{row.city} · {row.day?.slice(0, 10)}</div><strong>{row.name}</strong></article>
        <article className="card" style={{ padding: 16 }}><div className="muted">Expense</div><strong>${row.expense.toFixed(2)}</strong></article>
      </div>)}
    </div>
  </Page3D>;
}
