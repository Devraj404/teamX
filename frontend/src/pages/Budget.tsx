import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, type ApiBudget } from "../api";
import { Page3D } from "../components/Motion";

const categoryOrder = ["transport", "accommodation", "activities", "meals", "other"];

export function BudgetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<ApiBudget | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const tripId = Number(id);
    if (!Number.isInteger(tripId) || tripId < 1) {
      setError("Trip not found");
      return;
    }

    api.getBudget(tripId)
      .then(setBudget)
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : "Could not load budget.");
      });
  }, [id]);

  if (error) return <Page3D>{error}</Page3D>;
  if (!budget) return <Page3D>Loading budget...</Page3D>;

  const categories = categoryOrder.filter((category) => budget.byCategory[category] !== undefined);

  return (
    <Page3D>
      <button className="chip" onClick={() => navigate(`/trips/${budget.tripId}`)}>Back to itinerary</button>
      <h1>Trip budget & cost breakdown</h1>
      <p className="muted">
        Planned: ${budget.plannedBudget.toFixed(2)} · Spent: ${budget.total.toFixed(2)} · Remaining: ${budget.remainingBudget.toFixed(2)} · Average per day: ${budget.averagePerDay?.toFixed(2) || "0.00"}
      </p>
      {budget.isOverBudget && <div className="alert" style={{ margin: "16px 0" }}>Warning: total expenses are ${Math.abs(budget.remainingBudget).toFixed(2)} over the planned budget.</div>}
      <div className="grid" style={{ marginTop: 20 }}>
        <section className="chart-box">
          <strong>By category</strong>
          {categories.map((category) => (
            <div className="stat" key={category}>
              <span>{category}</span>
              <strong>${budget.byCategory[category].toFixed(2)}</strong>
            </div>
          ))}
          {categories.length === 0 && <p className="muted">No expenses recorded yet.</p>}
        </section>
        <section className="chart-box">
          <strong>By section</strong>
          {budget.bySection.map((section) => (
            <div className="stat" key={section.sectionId}>
              <span>{section.city.cityName}{section.isOverBudget ? " - over budget" : ""}</span>
              <strong>${section.activityTotal.toFixed(2)} / ${section.budget?.toFixed(2) || "0.00"}</strong>
            </div>
          ))}
          {budget.bySection.length === 0 && <p className="muted">No itinerary sections yet.</p>}
        </section>
      </div>
    </Page3D>
  );
}
