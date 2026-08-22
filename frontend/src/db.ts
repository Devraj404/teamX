import { seed } from "./seed";
import type {
  Activity,
  City,
  CommunityPost,
  Database,
  SectionActivity,
  Trip,
  TripSection,
  User,
} from "./types";

const KEY = "globetrotter.db.v4";
const SESSION = "globetrotter.session";
const REMEMBERED_USERNAME = "globetrotter.remembered-username";

function load(): Database {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return structuredClone(seed);
  }
  try {
    return JSON.parse(raw) as Database;
  } catch {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return structuredClone(seed);
  }
}

function save(db: Database) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

function nextId<T extends object>(list: T[], field: keyof T) {
  return Math.max(0, ...list.map((row) => Number(row[field]) || 0)) + 1;
}

export const db = {
  all: () => load(),
  reset: () => {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return structuredClone(seed);
  },

  getUser: (id: number) => load().users.find((u) => u.user_id === id),
  getUserByUsername: (username: string) =>
    load().users.find((u) => u.username.toLowerCase() === username.toLowerCase()),
  login: (username: string, password: string, remember = false) => {
    const user = load().users.find(
      (u) =>
        (u.username.toLowerCase() === username.toLowerCase() ||
          u.email.toLowerCase() === username.toLowerCase()) &&
        u.password === password,
    );
    if (user) {
      localStorage.setItem(SESSION, String(user.user_id));
      if (remember) localStorage.setItem(REMEMBERED_USERNAME, user.username);
      else localStorage.removeItem(REMEMBERED_USERNAME);
    }
    return user ?? null;
  },
  logout: () => localStorage.removeItem(SESSION),
  rememberedUsername: () => localStorage.getItem(REMEMBERED_USERNAME) || "",
  currentUser: () => {
    const id = Number(localStorage.getItem(SESSION));
    if (!id) return null;
    return load().users.find((u) => u.user_id === id) ?? null;
  },
  register: (payload: Omit<User, "user_id" | "role">) => {
    const data = load();
    const user: User = { ...payload, user_id: nextId(data.users, "user_id"), role: "traveler" };
    data.users.push(user);
    save(data);
    localStorage.setItem(SESSION, String(user.user_id));
    return user;
  },
  updateUser: (user: User) => {
    const data = load();
    data.users = data.users.map((u) => (u.user_id === user.user_id ? user : u));
    save(data);
    return user;
  },
  deleteUser: (userId: number) => {
    const data = load();
    data.users = data.users.filter((u) => u.user_id !== userId);
    save(data);
  },

  cities: () => load().cities,
  city: (id: number) => load().cities.find((c) => c.city_id === id),
  upsertCity: (city: City) => {
    const data = load();
    const existing = data.cities.find((c) => c.city_id === city.city_id);
    if (existing) data.cities = data.cities.map((c) => (c.city_id === city.city_id ? city : c));
    else data.cities.push({ ...city, city_id: nextId(data.cities, "city_id") });
    save(data);
  },
  deleteCity: (id: number) => {
    const data = load();
    data.cities = data.cities.filter((c) => c.city_id !== id);
    save(data);
  },

  activities: () => load().activities,
  activitiesByCity: (cityId: number) => load().activities.filter((a) => a.city_id === cityId),
  upsertActivity: (activity: Activity) => {
    const data = load();
    const existing = data.activities.find((a) => a.activity_id === activity.activity_id);
    if (existing)
      data.activities = data.activities.map((a) =>
        a.activity_id === activity.activity_id ? activity : a,
      );
    else data.activities.push({ ...activity, activity_id: nextId(data.activities, "activity_id") });
    save(data);
  },
  deleteActivity: (id: number) => {
    const data = load();
    data.activities = data.activities.filter((a) => a.activity_id !== id);
    save(data);
  },

  tripsByUser: (userId: number) => load().trips.filter((t) => t.user_id === userId),
  trip: (id: number) => load().trips.find((t) => t.trip_id === id),
  tripBySlug: (slug: string) => load().trips.find((t) => t.public_slug === slug),
  saveTrip: (trip: Omit<Trip, "trip_id"> & { trip_id?: number }) => {
    const data = load();
    if (trip.trip_id) {
      data.trips = data.trips.map((t) => (t.trip_id === trip.trip_id ? (trip as Trip) : t));
      save(data);
      return trip as Trip;
    }
    const created: Trip = {
      ...trip,
      trip_id: nextId(data.trips, "trip_id"),
      public_slug:
        trip.public_slug ||
        `${trip.trip_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
    };
    data.trips.push(created);
    save(data);
    return created;
  },
  deleteTrip: (id: number) => {
    const data = load();
    const sectionIds = data.trip_sections.filter((s) => s.trip_id === id).map((s) => s.section_id);
    data.section_activities = data.section_activities.filter(
      (a) => !sectionIds.includes(a.section_id),
    );
    data.trip_sections = data.trip_sections.filter((s) => s.trip_id !== id);
    data.trips = data.trips.filter((t) => t.trip_id !== id);
    save(data);
  },

  sectionsForTrip: (tripId: number) =>
    load()
      .trip_sections.filter((s) => s.trip_id === tripId)
      .sort((a, b) => a.section_order - b.section_order),
  saveSection: (section: Omit<TripSection, "section_id"> & { section_id?: number }) => {
    const data = load();
    if (section.section_id) {
      data.trip_sections = data.trip_sections.map((s) =>
        s.section_id === section.section_id ? (section as TripSection) : s,
      );
      save(data);
      return section as TripSection;
    }
    const created: TripSection = {
      ...section,
      section_id: nextId(data.trip_sections, "section_id"),
    };
    data.trip_sections.push(created);
    save(data);
    return created;
  },
  deleteSection: (id: number) => {
    const data = load();
    data.section_activities = data.section_activities.filter((a) => a.section_id !== id);
    data.trip_sections = data.trip_sections.filter((s) => s.section_id !== id);
    save(data);
  },

  activitiesForSection: (sectionId: number) =>
    load()
      .section_activities.filter((a) => a.section_id === sectionId)
      .sort((a, b) => a.activity_order - b.activity_order),
  activitiesForTrip: (tripId: number) => {
    const data = load();
    const ids = data.trip_sections.filter((s) => s.trip_id === tripId).map((s) => s.section_id);
    return data.section_activities.filter((a) => ids.includes(a.section_id));
  },
  saveSectionActivity: (
    row: Omit<SectionActivity, "section_activity_id" | "activity_order"> & {
      section_activity_id?: number;
      activity_order?: number;
    },
  ) => {
    const data = load();
    if (row.section_activity_id) {
      data.section_activities = data.section_activities.map((a) =>
        a.section_activity_id === row.section_activity_id ? (row as SectionActivity) : a,
      );
      save(data);
      return row as SectionActivity;
    }
    const created: SectionActivity = {
      ...row,
      activity_order:
        row.activity_order ??
        Math.max(
          0,
          ...data.section_activities
            .filter((a) => a.section_id === row.section_id)
            .map((a) => a.activity_order),
        ) + 1,
      section_activity_id: nextId(data.section_activities, "section_activity_id"),
    };
    data.section_activities.push(created);
    save(data);
    return created;
  },
  deleteSectionActivity: (id: number) => {
    const data = load();
    data.section_activities = data.section_activities.filter((a) => a.section_activity_id !== id);
    save(data);
  },

  posts: () =>
    load().community_posts.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    ),
  addPost: (post: Omit<CommunityPost, "post_id" | "created_at">) => {
    const data = load();
    const created: CommunityPost = {
      ...post,
      post_id: nextId(data.community_posts, "post_id"),
      created_at: new Date().toISOString(),
    };
    data.community_posts.unshift(created);
    save(data);
    return created;
  },
};

export function tripStatus(trip: Trip, today = new Date()) {
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${day}`;
  const startStr = trip.start_date ? trip.start_date.slice(0, 10) : "";
  const endStr = trip.end_date ? trip.end_date.slice(0, 10) : "";

  if (startStr && startStr > todayStr) return "Upcoming";
  if (endStr && endStr < todayStr) return "Completed";
  return "Ongoing";
}

export function money(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);
}

export function dayCount(start: string, end: string) {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}
