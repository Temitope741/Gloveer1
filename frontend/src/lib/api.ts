const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let authToken: string | null = null;

// ─── Helper: Store token in memory ───
export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

// ─── Helper: Make API requests ───
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add JWT token if available
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // For cookies if needed later
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ─── Auth API ───
export const authAPI = {
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (data: { name: string; email: string; password: string; role?: string }) =>
    request<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () => {
    setAuthToken(null);
    return Promise.resolve();
  },

  getMe: () =>
    request<any>("/auth/me", { method: "GET" }),
};

// ─── Users API ───
export const usersAPI = {
  getAll: () =>
    request<any[]>("/users", { method: "GET" }),

  getById: (id: string) =>
    request<any>(`/users/${id}`, { method: "GET" }),

  update: (id: string, data: any) =>
    request<any>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<void>(`/users/${id}`, { method: "DELETE" }),
};

// ─── Courses API ───
export const coursesAPI = {
  getAll: () =>
    request<any[]>("/courses", { method: "GET" }),

  getById: (id: string) =>
    request<any>(`/courses/${id}`, { method: "GET" }),

  create: (data: any) =>
    request<any>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    request<any>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<void>(`/courses/${id}`, { method: "DELETE" }),
};

// ─── Assessments API ───
export const assessmentsAPI = {
  getAll: () =>
    request<any[]>("/assessments", { method: "GET" }),

  getById: (id: string) =>
    request<any>(`/assessments/${id}`, { method: "GET" }),

  create: (data: any) =>
    request<any>("/assessments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    request<any>(`/assessments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<void>(`/assessments/${id}`, { method: "DELETE" }),
};

// ─── Submissions API ───
export const submissionsAPI = {
  getAll: () =>
    request<any[]>("/submissions", { method: "GET" }),

  getById: (id: string) =>
    request<any>(`/submissions/${id}`, { method: "GET" }),

  create: (data: any) =>
    request<any>("/submissions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  grade: (id: string, score: number, feedback: string) =>
    request<any>(`/submissions/${id}/grade`, {
      method: "PUT",
      body: JSON.stringify({ score, feedback }),
    }),
};

// ─── Progress API ───
export const progressAPI = {
  getProgress: (courseId: string) =>
    request<any>(`/progress/${courseId}`, { method: "GET" }),
};