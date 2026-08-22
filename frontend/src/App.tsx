import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Shell } from "./components/Shell";
import { api, type ApiUser } from "./api";
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

function frontendUser(user: ApiUser): User {
  return {
    user_id: user.userId,
    username: user.username,
    password: "",
    photo: user.photo || "",
    first_name: user.firstName || "",
    last_name: user.lastName || "",
    email: user.email || "",
    phone_number: user.phoneNumber || "",
    city: user.city || "",
    country: user.country || "",
    additional_information: user.additionalInformation || "",
    role: "traveler",
  };
}

function RequireAuth({
  user,
  authReady,
  children,
}: {
  user: User | null;
  authReady?: boolean;
  children: React.ReactNode;
}) {
  if (authReady === false) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Shell user={user}>{children}</Shell>;
}

function RequireAdmin({
  user,
  authReady,
  children,
}: {
  user: User | null;
  authReady?: boolean;
  children: React.ReactNode;
}) {
  if (authReady === false) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <Shell user={user}>{children}</Shell>;
}

export function App() {
  const location = useLocation();
  const [, setTick] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      setAuthReady(false);
      if (!api.token()) {
        setUser(null);
        setAuthReady(true);
        return;
      }
      api.me()
        .then(({ user: apiUser }) => {
          setUser(frontendUser(apiUser));
          setAuthReady(true);
        })
        .catch(() => {
          api.clearToken();
          setUser(null);
          setAuthReady(true);
        });
    };
    loadUser();
    window.addEventListener("globetrotter-auth-changed", loadUser);
    return () => window.removeEventListener("globetrotter-auth-changed", loadUser);
  }, []);

  return (
    <>
      <div className="noise" aria-hidden="true" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className="route-transition"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
        <Routes location={location}>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
          <Route path="/forgot" element={<ForgotPage />} />
          <Route path="/share/:slug" element={<SharePage />} />

          <Route
            path="/"
            element={
              <RequireAuth user={user} authReady={authReady}>
                {user && <DashboardPage user={user} />}
              </RequireAuth>
            }
          />
          <Route
            path="/trips"
            element={
              <RequireAuth user={user} authReady={authReady}>
                {user && <MyTripsPage user={user} />}
              </RequireAuth>
            }
          />
          <Route
            path="/trips/new"
            element={
              <RequireAuth user={user} authReady={authReady}>
                {user && <CreateTripPage user={user} />}
              </RequireAuth>
            }
          />
          <Route
            path="/trips/:id"
            element={
              <RequireAuth user={user} authReady={authReady}>
                <ItineraryViewPage />
              </RequireAuth>
            }
          />
          <Route
            path="/trips/:id/build"
            element={
              <RequireAuth user={user} authReady={authReady}>
                <BuildItineraryPage />
              </RequireAuth>
            }
          />
          <Route
            path="/trips/:id/budget"
            element={
              <RequireAuth user={user} authReady={authReady}>
                <BudgetPage />
              </RequireAuth>
            }
          />
          <Route
            path="/trips/:id/calendar"
            element={
              <RequireAuth user={user} authReady={authReady}>
                {user && <CalendarPage user={user} />}
              </RequireAuth>
            }
          />
          <Route
            path="/search"
            element={
              <RequireAuth user={user} authReady={authReady}>
                <SearchPage />
              </RequireAuth>
            }
          />
          <Route
            path="/community"
            element={
              <RequireAuth user={user} authReady={authReady}>
                {user && <CommunityPage user={user} />}
              </RequireAuth>
            }
          />
          <Route
            path="/calendar"
            element={
              <RequireAuth user={user} authReady={authReady}>
                {user && <CalendarPage user={user} />}
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth user={user} authReady={authReady}>
                {user && <ProfilePage user={user} onChange={() => setTick((n) => n + 1)} />}
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin user={user} authReady={authReady}>
                {user && <AdminPage />}
              </RequireAdmin>
            }
          />
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
        </motion.main>
      </AnimatePresence>
    </>
  );
}
