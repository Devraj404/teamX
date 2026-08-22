const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const TOKEN_KEY = "globetrotter.access-token";

export type ApiUser = {
  userId: number;
  username: string;
  photo: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  city: string | null;
  country: string | null;
  additionalInformation: string | null;
};

export type ApiCity = {
  cityId: number;
  cityName: string;
  country: string | null;
  region: string | null;
  costIndex: string | number | null;
  popularity: number | null;
};

export type ApiTrip = {
  tripId: number;
  userId: number;
  tripName: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  coverPhoto: string | null;
  isPublic: boolean;
  status: "upcoming" | "ongoing" | "completed";
  sections: ApiSection[];
};

export type ApiSection = {
  sectionId: number;
  tripId: number;
  cityId: number;
  sectionOrder: number;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  budget: string | number | null;
  city?: ApiCity;
  sectionActivities?: Array<{
    sectionActivityId: number;
    activityId?: number | null;
    activityName: string | null;
    activityDate: string | null;
    expense: string | number | null;
    expenseCategory?: string;
    activity?: ApiActivity;
  }>;
};

export type ApiActivity = {
  activityId: number;
  cityId: number;
  activityName: string;
  type: string;
  cost: string | number | null;
  duration: number | null;
  description: string | null;
  city?: ApiCity;
};

export type ApiPost = {
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  user?: ApiUser;
};

export type ApiBudget = {
  tripId: number;
  total: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  averagePerDay: number | null;
  plannedBudget: number;
  remainingBudget: number;
  isOverBudget: boolean;
  bySection: Array<{ sectionId: number; city: ApiCity; budget: number | null; activityTotal: number; remainingBudget: number | null; isOverBudget: boolean }>;
};

type ApiOptions = RequestInit & { auth?: boolean };

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { auth = false, headers, ...init } = options;
  const token = localStorage.getItem(TOKEN_KEY);
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${API_URL}${cleanPath}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const text = await response.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    const message = typeof body === "object" && body && "message" in body
      ? String(body.message)
      : "Request failed";
    throw new Error(message);
  }

  return body as T;
}

export const api = {
  token: () => localStorage.getItem(TOKEN_KEY),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  login: (identifier: string, password: string) =>
    request<{ user: ApiUser; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(identifier.includes("@") ? { email: identifier, password } : { username: identifier, password }),
    }),
  register: (payload: Record<string, unknown>) =>
    request<{ user: ApiUser; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () => request<{ user: ApiUser }>("/auth/me", { auth: true }),
  updateMe: (payload: Record<string, unknown>) => request<{ user: ApiUser }>("/auth/me", { method: "PATCH", auth: true, body: JSON.stringify(payload) }),
  deleteMe: () => request<void>("/auth/me", { method: "DELETE", auth: true }),
  cities: (query = "") => request<{ cities: ApiCity[] }>(`/cities${query}`),
  trips: () => request<{ trips: ApiTrip[] }>("/trips", { auth: true }),
  trip: (tripId: number) => request<{ trip: ApiTrip }>(`/trips/${tripId}`, { auth: true }),
  createTrip: (payload: Record<string, unknown>) =>
    request<{ trip: ApiTrip }>("/trips", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
  createSection: (tripId: number, payload: Record<string, unknown>) =>
    request<{ section: ApiSection }>(`/trips/${tripId}/sections`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
  updateSection: (tripId: number, sectionId: number, payload: Record<string, unknown>) =>
    request<{ section: ApiSection }>(`/trips/${tripId}/sections/${sectionId}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    }),
  deleteSection: (tripId: number, sectionId: number) =>
    request<void>(`/trips/${tripId}/sections/${sectionId}`, { method: "DELETE", auth: true }),
  activities: (query = "") => request<{ activities: ApiActivity[] }>(`/activities${query}`),
  createSectionActivity: (tripId: number, sectionId: number, payload: Record<string, unknown>) =>
    request<{ activity: ApiSection["sectionActivities"] extends Array<infer Item> ? Item : never }>(`/trips/${tripId}/sections/${sectionId}/activities`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
  getBudget: (tripId: number) => request<ApiBudget>(`/trips/${tripId}/budget`, { auth: true }),
  publicTrip: (tripId: number) => request<{ trip: ApiTrip }>(`/public/trips/${tripId}`),
  deleteTrip: (tripId: number) =>
    request<void>(`/trips/${tripId}`, { method: "DELETE", auth: true }),
  posts: () => request<{ posts: ApiPost[] }>("/posts"),
  createPost: (content: string) =>
    request<{ post: ApiPost }>("/posts", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ content }),
    }),
  deletePost: (postId: number) =>
    request<void>(`/posts/${postId}`, { method: "DELETE", auth: true }),
  logout: () => {
    api.clearToken();
    window.dispatchEvent(new Event("globetrotter-auth-changed"));
  },
};

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("globetrotter-auth-changed"));
}