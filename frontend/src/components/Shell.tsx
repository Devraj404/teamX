import { NavLink, useNavigate } from "react-router-dom";
import { db } from "../db";
import type { User } from "../types";

export function Shell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          Globetrotter
        </div>
        <form
          className="search-cluster"
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q");
            navigate(`/search?q=${encodeURIComponent(String(q || ""))}`);
          }}
        >
          <input name="q" placeholder="Search cities, activities, trips…" />
          <button className="chip" type="button" onClick={() => navigate("/search?tab=cities&group=region")}>
            Group by
          </button>
          <button className="chip" type="button" onClick={() => navigate("/search?tab=cities&filter=popular")}>
            Filter
          </button>
          <button className="chip" type="button" onClick={() => navigate("/search?tab=cities&sort=cost")}>
            Sort by
          </button>
        </form>
        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/trips">Trips</NavLink>
          <NavLink to="/community">Community</NavLink>
          <NavLink to="/calendar">Calendar</NavLink>
          {user.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
          <NavLink to="/profile" title="Profile">
            <span className="avatar avatar-initial" aria-label={`${user.first_name}'s profile`}>
              {(user.first_name || user.username).slice(0, 1).toUpperCase()}
            </span>
          </NavLink>
          <button
            className="btn-ghost"
            onClick={() => {
              db.logout();
              navigate("/login");
            }}
          >
            Exit
          </button>
        </nav>
      </header>
      {children}
    </div>
  );
}
