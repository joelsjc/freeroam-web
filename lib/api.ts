import type { LoginResponse, NewsEvent, NewsListResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api/v1";
const TOKEN_KEY = "freeroam_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const body = await res.json();
      message = body.message || message;
    } catch {
      // corpo não era JSON, mantém mensagem genérica
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export interface NewsFilters {
  category?: string;
  confidence?: string;
  search?: string;
}

export async function fetchNews(filters: NewsFilters = {}): Promise<NewsEvent[]> {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.confidence) params.set("confidence", filters.confidence);
  if (filters.search) params.set("search", filters.search);
  const qs = params.toString();

  const result = await request<NewsListResponse | NewsEvent[]>(`/news${qs ? `?${qs}` : ""}`);
  // A API pode responder com array puro ou com { data, total } — normaliza os dois casos
  return Array.isArray(result) ? result : result.data;
}

export async function fetchNewsById(id: string): Promise<NewsEvent> {
  return request<NewsEvent>(`/news/${id}`);
}

export { ApiError };
