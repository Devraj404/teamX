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

type ApiOptions = RequestInit & { auth?: boolean };

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { auth = false, headers, ...init } = options;
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
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
  logout: () => {
    api.clearToken();
    window.dispatchEvent(new Event("globetrotter-auth-changed"));
  },
};

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("globetrotter-auth-changed"));
}