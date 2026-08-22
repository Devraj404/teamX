import { useMemo, useState } from "react";
import { Page3D } from "../components/Motion";
import { db, money, tripStatus } from "../db";

const tabs = ["Users list", "Trips list", "Traffic analysis", "User feedback and reports"] as const;

export function AdminPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Users list");
  const [, bump] = useState(0);
  const refresh = () => bump((n) => n + 1);
  const data = db.all();
  const [q, setQ] = useState("");

  const users = data.users.filter((u) => {
    const hay = `${u.username} ${u.first_name} ${u.last_name} ${u.email} ${u.city}`.toLowerCase();
    return !q || hay.includes(q.toLowerCase());
  });
  const trips = data.trips.filter((t) => !q || t.trip_name.toLowerCase().includes(q.toLowerCase()));

  const traffic = useMemo(() => {
    const byRegion = data.cities.reduce<Record<string, number>>((acc, c) => {
      acc[c.region] = (acc[c.region] || 0) + c.popularity;
      return acc;
    }, {});
    const statusCounts = data.trips.reduce<Record<string, number>>((acc, t) => {
      const s = tripStatus(t);
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    return { byRegion, statusCounts };
  }, [data]);

  return (
    <Page3D>
      <h1>Admin panel</h1>
      <p className="muted">
        Manage accounts, review every trip, watch catalog traffic, and read community reports.
      </p>
      <div className="tabs" style={{ margin: "18px 0" }}>
        {tabs.map((t) => (
          <button key={t} className="chip" onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <input
        placeholder="Search this tab…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ maxWidth: 420, marginBottom: 18 }}
      />

      {tab === "Users list" && (
        <div className="grid">
          <p className="muted">
            User details and account status. Deactivate (demo: remove session role) or delete an account.
          </p>
          {users.map((u) => (
            <article key={u.user_id} className="card list-card">
              <img src={u.photo} alt="" />
              <div>
                <strong>
                  {u.first_name} {u.last_name} (@{u.username})
                </strong>
                <div className="muted">
                  {u.email} · {u.city}, {u.country} · {u.role}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="chip"
                  onClick={() => {
                    db.updateUser({ ...u, role: u.role === "admin" ? "traveler" : u.role });
                    refresh();
                  }}
                >
                  Traveler
                </button>
                <button
                  className="chip"
                  onClick={() => {
                    if (confirm(`Delete ${u.username}?`)) {
                      db.deleteUser(u.user_id);
                      refresh();
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "Trips list" && (
        <div className="grid">
          <p className="muted">All trips, categorized by search and status.</p>
          {trips.map((t) => {
            const owner = db.getUser(t.user_id);
            return (
              <article key={t.trip_id} className="card list-card">
                <img src={t.cover_photo} alt="" />
                <div>
                  <strong>{t.trip_name}</strong>
                  <div className="muted">
                    {owner?.username} · {t.start_date} → {t.end_date} · {tripStatus(t)}
                  </div>
                </div>
                <button
                  className="chip"
                  onClick={() => {
                    db.deleteTrip(t.trip_id);
                    refresh();
                  }}
                >
                  Remove
                </button>
              </article>
            );
          })}
        </div>
      )}

      {tab === "Traffic analysis" && (
        <div className="charts">
          <div className="chart-box" style={{ height: "auto" }}>
            <strong>Catalog popularity by region</strong>
            {Object.entries(traffic.byRegion).map(([region, score]) => (
              <div key={region} className="stat">
                <span>{region}</span>
                <strong>{score}</strong>
              </div>
            ))}
          </div>
          <div className="chart-box" style={{ height: "auto" }}>
            <strong>Trip volume</strong>
            <div className="stat">
              <span>Users</span>
              <strong>{data.users.length}</strong>
            </div>
            <div className="stat">
              <span>Trips</span>
              <strong>{data.trips.length}</strong>
            </div>
            <div className="stat">
              <span>Cities</span>
              <strong>{data.cities.length}</strong>
            </div>
            <div className="stat">
              <span>Activities</span>
              <strong>{data.activities.length}</strong>
            </div>
            {Object.entries(traffic.statusCounts).map(([k, v]) => (
              <div key={k} className="stat">
                <span>{k} trips</span>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "User feedback and reports" && (
        <div className="grid">
          <p className="muted">Community posts stand in for feedback and activity reports in this demo.</p>
          {db.posts().map((post) => {
            const author = db.getUser(post.user_id);
            return (
              <article key={post.post_id} className="card feed-card">
                <img className="avatar" src={author?.photo} alt="" />
                <div>
                  <strong>
                    {author?.first_name} {author?.last_name}
                  </strong>
                  <div className="muted">{new Date(post.created_at).toLocaleString()}</div>
                  <p>{post.content}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="muted" style={{ marginTop: 24 }}>
        Demo store is local only. Planned section budgets across catalog:{" "}
        {money(data.trip_sections.reduce((s, sec) => s + Number(sec.budget || 0), 0))}
      </p>
    </Page3D>
  );
}
