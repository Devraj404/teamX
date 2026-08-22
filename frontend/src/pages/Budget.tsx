import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Page3D } from "../components/Motion";
import { db, dayCount, money } from "../db";

const cats = ["transport", "stay", "activities", "meals"] as const;

export function BudgetPage() {
  const { id } = useParams();
  const trip = db.trip(Number(id));
  const sections = trip ? db.sectionsForTrip(trip.trip_id) : [];
  const items = trip ? db.activitiesForTrip(trip.trip_id) : [];
  const byCat = useMemo(() => {
    const map = Object.fromEntries(cats.map((c) => [c, 0])) as Record<(typeof cats)[number], number>;
    items.forEach((i) => {
      map[i.category] += Number(i.expense);
    });
    return map;
  }, [items]);
  const total = Object.values(byCat).reduce((a, b) => a + b, 0);
  const planned = sections.reduce((a, s) => a + Number(s.budget), 0);
  const estimatedByCat = total > 0
    ? byCat
    : { transport: planned * 0.15, stay: planned * 0.35, activities: planned * 0.35, meals: planned * 0.15 };
  const displayTotal = total || planned;
  const days = trip ? dayCount(trip.start_date, trip.end_date) : 1;
  const perDay = displayTotal / days;
  const over = sections.filter((s) => {
    const spent = db.activitiesForSection(s.section_id).reduce((a, x) => a + Number(x.expense), 0);
    return s.budget > 0 && spent > s.budget;
  });

  if (!trip) return <Page3D>Trip not found.</Page3D>;

  return (
    <Page3D>
      <h1>Trip budget & cost breakdown</h1>
      <p className="muted">
        Planned {money(planned)} · booked {money(total)} · estimated average {money(perDay)} / day
      </p>
      {over.length > 0 && (
        <div className="alert" style={{ margin: "16px 0" }}>
          Over-budget sections: {over.map((s) => s.description.slice(0, 40)).join(" · ")}
        </div>
      )}
      <div className="charts" style={{ marginTop: 20 }}>
        <div className="chart-box">
          <strong>{total ? "Booked cost by category" : "Estimated cost mix"}</strong>
          {!total && <p className="muted">Add activities to replace this planning estimate with live costs.</p>}
          <svg viewBox="0 0 120 120" width="180" height="180">
            {(() => {
              let acc = 0;
              const colors = ["#8a8680", "#cfc8bc", "#5c5a56", "#d9d4cc"];
              return cats.map((cat, i) => {
                const value = estimatedByCat[cat] / Math.max(displayTotal, 1);
                const start = acc;
                acc += value;
                const a0 = start * Math.PI * 2 - Math.PI / 2;
                const a1 = acc * Math.PI * 2 - Math.PI / 2;
                const x0 = 60 + 40 * Math.cos(a0);
                const y0 = 60 + 40 * Math.sin(a0);
                const x1 = 60 + 40 * Math.cos(a1);
                const y1 = 60 + 40 * Math.sin(a1);
                const large = value > 0.5 ? 1 : 0;
                return (
                  <path
                    key={cat}
                    d={`M60,60 L${x0},${y0} A40,40 0 ${large} 1 ${x1},${y1} Z`}
                    fill={colors[i]}
                  />
                );
              });
            })()}
          </svg>
          {cats.map((c) => (
            <div key={c} className="stat">
              <span>{c}</span>
              <strong>{money(estimatedByCat[c])}</strong>
            </div>
          ))}
        </div>
        <div className="chart-box">
          <strong>Section budgets</strong>
          {sections.map((s) => (
            <div key={s.section_id} style={{ marginTop: 12 }}>
              <div className="muted">{s.description.slice(0, 48)}</div>
              <div
                style={{
                  height: 12,
                  borderRadius: 99,
                    background: "var(--bg-soft)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.max(4, Math.min(100, (Number(s.budget) / Math.max(planned, 1)) * 100))}%`,
                    height: "100%",
                    background: "var(--stone)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page3D>
  );
}
