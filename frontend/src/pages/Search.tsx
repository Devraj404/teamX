import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Page3D } from "../components/Motion";
import { db, money } from "../db";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const q = (params.get("q") || "").toLowerCase();
  const tab = params.get("tab") || "cities";
  const sort = params.get("sort") || "popularity";
  const filter = params.get("filter") || "all";
  const group = params.get("group") || "none";
  const tripId = Number(params.get("trip") || 0);
  const sectionId = Number(params.get("section") || 0);
  const [type, setType] = useState("all");
  const [maxCost, setMaxCost] = useState(200);
  const [region, setRegion] = useState("all");
  const regions = [...new Set(db.cities().map((city) => city.region))].sort();

  const cities = useMemo(() => {
    let list = db.cities().filter(
      (c) =>
        !q ||
        c.city_name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q),
    );
    if (filter === "popular") list = list.filter((c) => c.popularity >= 88);
    if (region !== "all") list = list.filter((c) => c.region === region);
    if (sort === "cost") list = [...list].sort((a, b) => a.cost_index - b.cost_index);
    else list = [...list].sort((a, b) => b.popularity - a.popularity);
    return list;
  }, [q, sort, filter]);

  const activities = useMemo(() => {
    return db
      .activities()
      .filter((a) => {
        const city = db.city(a.city_id);
        const hay = `${a.activity_name} ${a.description} ${city?.city_name} ${a.type}`.toLowerCase();
        const okQ = !q || hay.includes(q);
        const okType = type === "all" || a.type === type;
        const okCost = a.cost <= maxCost;
        return okQ && okType && okCost;
      });
  }, [q, type, maxCost]);

  const grouped = group === "region"
    ? Object.entries(
        cities.reduce<Record<string, typeof cities>>((acc, c) => {
          acc[c.region] = acc[c.region] || [];
          acc[c.region].push(c);
          return acc;
        }, {}),
      )
    : [["All", cities] as const];

  const addCityToTrip = (cityId: number) => {
    if (!tripId) {
      navigate("/trips/new");
      return;
    }
    const city = db.city(cityId)!;
    const trip = db.trip(tripId)!;
    db.saveSection({
      trip_id: tripId,
      section_order: db.sectionsForTrip(tripId).length + 1,
      description: `${city.city_name}, ${city.country}`,
      start_date: trip.start_date,
      end_date: trip.end_date,
      budget: 0,
      city_id: city.city_id,
    });
    navigate(`/trips/${tripId}/build`);
  };

  const addActivity = (activityId: number) => {
    const activity = db.activities().find((a) => a.activity_id === activityId)!;
    const sid = sectionId || db.sectionsForTrip(tripId)[0]?.section_id;
    if (!tripId || !sid) {
      navigate("/trips/new");
      return;
    }
    db.saveSectionActivity({
      section_id: sid,
      activity_id: activity.activity_id,
      activity_order: db.activitiesForSection(sid).length + 1,
      activity_date: db.sectionsForTrip(tripId).find((s) => s.section_id === sid)?.start_date || "",
      activity_name: activity.activity_name,
      expense: activity.cost,
      category: activity.type === "Food" ? "meals" : "activities",
    });
    navigate(`/trips/${tripId}/build`);
  };

  return (
    <Page3D>
      <h1>Search</h1>
      <p className="muted">Cities with country, cost index, and popularity — or activities by type, cost, and duration.</p>
      <div className="search-cluster" style={{ margin: "16px 0 20px" }}>
        <input
          defaultValue={params.get("q") || ""}
          placeholder="Option and its details…"
          onKeyDown={(e) => {
            if (e.key === "Enter") setParams({ ...Object.fromEntries(params), q: e.currentTarget.value, tab });
          }}
        />
          <button className="chip" onClick={() => setParams({ ...Object.fromEntries(params), tab: "cities" })}>Cities</button>
        <button className="chip" onClick={() => setParams({ ...Object.fromEntries(params), tab: "activities" })}>
          Activities
        </button>
      </div>

      {tab === "cities" ? (
        <div className="grid">
          <label style={{ maxWidth: 280 }}>
            Filter by region
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="all">All regions</option>
              {regions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          {grouped.map(([label, list]) => (
            <section key={label}>
              {group === "region" && <h3>{label}</h3>}
              {list.map((city) => (
                <article key={city.city_id} className="card list-card">
                  <img src={city.image} alt="" />
                  <div>
                    <strong>{city.city_name}</strong>
                    <div className="muted">
                      {city.country} · {city.region} · cost index {city.cost_index} · popularity {city.popularity}
                    </div>
                  </div>
                  <button className="btn" onClick={() => addCityToTrip(city.city_id)}>
                    Add to trip
                  </button>
                </article>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <>
          <div className="tabs" style={{ marginBottom: 16 }}>
            {["all", "Culture", "Food", "Adventure"].map((t) => (
              <button key={t} className="chip" onClick={() => setType(t)}>
                {t}
              </button>
            ))}
            <label className="muted">
              Max cost {money(maxCost)}
              <input type="range" min={10} max={200} value={maxCost} onChange={(e) => setMaxCost(Number(e.target.value))} />
            </label>
          </div>
          <div className="grid">
            {activities.map((a) => (
              <article key={a.activity_id} className="card list-card">
                <img src={a.image} alt="" />
                <div>
                  <strong>{a.activity_name}</strong>
                  <div className="muted">
                    {db.city(a.city_id)?.city_name} · {a.type} · {a.duration_hours}h · {money(a.cost)}
                  </div>
                  <p>{a.description}</p>
                </div>
                <button className="btn" onClick={() => addActivity(a.activity_id)}>
                  Add / assign
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </Page3D>
  );
}
