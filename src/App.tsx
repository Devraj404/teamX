import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Shell } from "./components/Shell";
import { db } from "./db";
import { AdminPage } from "./pages/Admin";
import { BudgetPage } from "./pages/Budget";
import { BuildItineraryPage } from "./pages/BuildItinerary";
import { CalendarPage } from "./pages/Calendar";
import { CommunityPage } from "./pages/Community";
import { CreateTripPage } from "./pages/CreateTrip";
import { DashboardPage } from "./pages/Dashboard";
import { ForgotPage } from "./pages/Forgot";
import { ItineraryViewPage } from "./pages/ItineraryView";
import { LoginPage } from "./pages/Login";
import { MyTripsPage } from "./pages/MyTrips";
import { ProfilePage } from "./pages/Profile";
import { RegisterPage } from "./pages/Register";
import { SearchPage } from "./pages/Search";
import { SharePage } from "./pages/Share";
import type { User } from "./types";

function RequireAuth({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  if (!user) return <Navigate to="/login" replace />;
  return <Shell user={user}>{children}</Shell>;
}

function RequireAdmin({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <Shell user={user}>{children}</Shell>;
}

export function App() {
  const location = useLocation();
  const [, setTick] = useState(0);
  const user = db.currentUser();

  return (
    <>
      <div className="noise" aria-hidden="true" />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
          <Route path="/forgot" element={<ForgotPage />} />
          <Route path="/share/:slug" element={<SharePage />} />

          <Route
            path="/"
            element={
              <RequireAuth user={user}>
                {user && <DashboardPage user={user} />}
              </RequireAuth>
            }
          />
          <Route
            path="/trips"
            element={
              <RequireAuth user={user}>
                {user && <MyTripsPage user={user} />}
              </RequireAuth>
            }
          />
          <Route
            path="/trips/new"
            element={
              <RequireAuth user={user}>
                {user && <CreateTripPage user={user} />}
              </RequireAuth>
            }
          />
          <Route
            path="/trips/:id"
            element={
              <RequireAuth user={user}>
                <ItineraryViewPage />
              </RequireAuth>
            }
          />
          <Route
            path="/trips/:id/build"
            element={
              <RequireAuth user={user}>
                <BuildItineraryPage />
              </RequireAuth>
            }
          />
          <Route
            path="/trips/:id/budget"
            element={
              <RequireAuth user={user}>
                <BudgetPage />
              </RequireAuth>
            }
          />
          <Route
            path="/trips/:id/calendar"
            element={
              <RequireAuth user={user}>
                {user && <CalendarPage user={user} />}
              </RequireAuth>
            }
          />
          <Route
            path="/search"
            element={
              <RequireAuth user={user}>
                <SearchPage />
              </RequireAuth>
            }
          />
          <Route
            path="/community"
            element={
              <RequireAuth user={user}>
                {user && <CommunityPage user={user} />}
              </RequireAuth>
            }
          />
          <Route
            path="/calendar"
            element={
              <RequireAuth user={user}>
                {user && <CalendarPage user={user} />}
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth user={user}>
                {user && <ProfilePage user={user} onChange={() => setTick((n) => n + 1)} />}
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin user={user}>
                {user && <AdminPage />}
              </RequireAdmin>
            }
          />
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
