import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, type ApiActivity, type ApiCity } from "../api";
import { Page3D } from "../components/Motion";

const fallbackImage = "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get("q") || "";
  const tab = params.get("tab") || (params.get("section") ? "activities" : "cities");
  const tripId = Number(params.get("trip") || 0);
  const sectionId = Number(params.get("section") || 0);
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [type, setType] = useState("all");
  const [maxCost, setMaxCost] = useState(200);
  const [region, setRegion] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.cities(),
      api.activities(`?${new URLSearchParams({
        ...(q ? { q } : {}),
        ...(type !== "all" ? { type: type.toLowerCase() } : {}),
        maxCost: String(maxCost),
      })}`),
    ])
      .then(([cityResponse, activityResponse]) => {
        setCities(cityResponse.cities);
        setActivities(activityResponse.activities);
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Could not load search results."))
      .finally(() => setLoading(false));
  }, [q, type, maxCost]);

  const regions = useMemo(
    () => [...new Set(cities.map((city) => city.region).filter((region): region is string => Boolean(region)))].sort(),
    [cities],
  );
  const visibleCities = useMemo(
    () => cities.filter((city) => region === "all" || city.region === region),
    [cities, region],
  );

  const addCityToTrip = async (cityId: number) => {
    if (!tripId) return navigate("/trips/new");
    try {
      const { trip } = await api.trip(tripId);
      await api.createSection(tripId, { cityId, sectionOrder: trip.sections.length + 1 });
      navigate(`/trips/${tripId}/build`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not add city to trip.");
    }
  };

  const addActivity = async (activity: ApiActivity) => {
    if (!tripId || !sectionId) {
      setError("Open an itinerary section before assigning an activity.");
      return;
    }
    try {
      await api.createSectionActivity(tripId, sectionId, {
        activityId: activity.activityId,
        expense: Number(activity.cost || 0),
        expenseCategory: activity.type === "food" ? "meals" : "activities",
      });
      navigate(`/trips/${tripId}/build`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not assign activity.");
    }
  };

  return (
    <Page3D>
      <h1>Search</h1>
      <p className="muted">Discover cities and activities from the live travel catalog.</p>
      <div className="search-cluster" style={{ margin: "16px 0 20px" }}>
        <input
          defaultValue={q}
          placeholder="Search cities and activities..."
          onKeyDown={(event) => {
            if (event.key === "Enter") setParams({ ...Object.fromEntries(params), q: event.currentTarget.value, tab });
          }}
        />
        <button className="chip" onClick={() => setParams({ ...Object.fromEntries(params), tab: "cities" })}>Cities</button>
        <button className="chip" onClick={() => setParams({ ...Object.fromEntries(params), tab: "activities" })}>Activities</button>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading ? <p className="muted">Loading live results...</p> : tab === "cities" ? (
        <div className="grid">
          <label style={{ maxWidth: 280 }}>
            Filter by region
            <select value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="all">All regions</option>
              {regions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          {visibleCities.map((city) => (
            <article key={city.cityId} className="card list-card">
              <img src={fallbackImage} alt="" />
              <div>
                <strong>{city.cityName}</strong>
                <div className="muted">{city.country || ""} · {city.region || ""} · cost index {city.costIndex ?? "-"} · popularity {city.popularity ?? "-"}</div>
              </div>
              <button className="btn" onClick={() => addCityToTrip(city.cityId)}>Add to trip</button>
            </article>
          ))}
        </div>
      ) : (
        <>
          <div className="tabs" style={{ marginBottom: 16 }}>
            {[["all", "All"], ["sightseeing", "Sightseeing"], ["food", "Food"], ["adventure", "Adventure"], ["other", "Other"]].map(([value, label]) => (
              <button key={value} className="chip" onClick={() => setType(value)}>{label}</button>
            ))}
            <label className="muted">Max cost {maxCost === 200 ? "$200+" : `$${maxCost}`}
              <input type="range" min={10} max={200} value={maxCost} onChange={(event) => setMaxCost(Number(event.target.value))} />
            </label>
          </div>
          <div className="grid">
            {activities.map((activity) => (
              <article key={activity.activityId} className="card list-card">
                <img src={fallbackImage} alt="" />
                <div>
                  <strong>{activity.activityName}</strong>
                  <div className="muted">{activity.city?.cityName || ""} · {activity.type} · {activity.duration ?? "-"}h · ${Number(activity.cost || 0).toFixed(2)}</div>
                  <p>{activity.description}</p>
                </div>
                <button className="btn" onClick={() => addActivity(activity)}>Add / assign</button>
              </article>
            ))}
          </div>
        </>
      )}
    </Page3D>
  );
}
