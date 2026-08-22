import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, type ApiBudget } from "../api";
import { Page3D } from "../components/Motion";

export function BudgetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<ApiBudget | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getBudget(Number(id))
      .then(setBudget)
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Could not load budget."));
  }, [id]);

  if (error) return <Page3D>{error}</Page3D>;
  if (!budget) return <Page3D>Loading budget...</Page3D>;

  return <Page3D>
    <button className="chip" onClick={() => navigate(`/trips/${id}`)}>Back to itinerary</button>
    <h1>Trip budget & cost breakdown</h1>
    <p className="muted">Booked activities: ${budget.total.toFixed(2)} · Average per day: ${budget.averagePerDay?.toFixed(2) || "0.00"}</p>
    <div className="grid" style={{ marginTop: 20 }}>
      <section className="chart-box"><strong>By category</strong>{Object.entries(budget.byCategory).map(([category, amount]) => <div className="stat" key={category}><span>{category}</span><strong>${amount.toFixed(2)}</strong></div>)}</section>
      <section className="chart-box"><strong>By section</strong>{budget.bySection.map((section) => <div className="stat" key={section.sectionId}><span>{section.city.cityName}</span><strong>${section.activityTotal.toFixed(2)}</strong></div>)}</section>
    </div>
  </Page3D>;
}
