import axios from "axios";
import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const api = axios.create({ baseURL: API_URL });

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// ─── Auth ──────────────────────────────────────────────
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    industry?: string;
    size?: string;
  }) => api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  me: () => api.get("/auth/me"),

  stats: () => api.get("/auth/stats"),

  updateProfile: (data: Record<string, unknown>) =>
    api.patch("/auth/profile", data),

  uploadLogo: (formData: FormData) =>
    api.post("/auth/profile/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  logout: () => api.post("/auth/logout"),
};

// ─── Jobs ──────────────────────────────────────────────
export const jobsApi = {
  list: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get("/jobs", { params }),

  publicList: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
  }) => api.get("/jobs/public", { params }),

  publicGet: (id: string) => api.get(`/jobs/public/${id}`),

  get: (id: string) => api.get(`/jobs/${id}`),

  create: (data: Record<string, unknown>) => api.post("/jobs", data),

  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/jobs/${id}`, data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/jobs/${id}/status`, { status }),

  delete: (id: string) => api.delete(`/jobs/${id}`),
};

// ─── Applications ──────────────────────────────────────
export const applicationsApi = {
  submit: (jobId: string, formData: FormData) =>
    api.post(`/applications/${jobId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  listByJob: (jobId: string, params?: { page?: number; stage?: string }) =>
    api.get(`/applications/job/${jobId}`, { params }),

  get: (id: string) => api.get(`/applications/${id}`),

  updateStage: (id: string, stage: string, note?: string) =>
    api.patch(`/applications/${id}/stage`, { stage, note }),

  updateNotes: (id: string, notes: string) =>
    api.patch(`/applications/${id}/notes`, { notes }),
};

// ─── Candidates ────────────────────────────────────────
export const candidatesApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get("/candidates", { params }),

  get: (id: string) => api.get(`/candidates/${id}`),
};

// ─── Subscriptions ─────────────────────────────────────
export const subscriptionsApi = {
  plans: () => api.get("/subscriptions/plans"),
  status: () => api.get("/subscriptions/status"),
  initialize: (plan: string) => api.post("/subscriptions/initialize", { plan }),
  verify: (reference: string) =>
    api.get(`/subscriptions/verify?reference=${reference}`),
};

// ─── Shared types ──────────────────────────────────────
export interface SubStatus {
  status: "active" | "inactive" | "trialing" | "cancelled" | null;
  plan: string | null;
  isActive: boolean;
  freeLimit: number;
  jobsUsed: number;
  quotaLeft: number | null; // null when subscribed (unlimited)
  quotaExhausted: boolean;
  planDetails: {
    name: string;
    priceNGN: number;
    jobLimit: number;
    features: string[];
  } | null;
  currentPeriodEnd: string | null;
}
