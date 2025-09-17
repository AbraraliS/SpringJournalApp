import axios from "axios"

// Use same-origin proxy path so the browser doesn't block requests from HTTPS preview -> HTTP backend.
export const API_BASE_URL = "/api/proxy"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  // Optional: small timeout to surface backend connectivity issues quickly
  timeout: 15000,
})

// Request: attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response: handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:logout"))
    }
    return Promise.reject(error)
  },
)

// SWR-friendly fetchers
export const swrFetcher = async (url: string) => {
  const res = await api.get(url)
  return res.data
}

// ---- User endpoints ----
export const registerUser = (payload: { username: string; password: string }) => api.post("/user", payload)
export const updateUser = (payload: { username?: string; password?: string }) => api.put("/user", payload)
export const deleteUserReq = () => api.delete("/user")
export const loginUser = (payload: { username: string; password: string }) => api.post("/auth/login", payload)

// ---- Journal endpoints ----
export const getJournals = () => api.get("/journal")
export const getJournalById = (id: string) => api.get(`/journal/id/${id}`)
export const createJournal = (payload: { title: string; content: string }) => api.post("/journal", payload)
export const updateJournal = (id: string, payload: { title?: string; content?: string }) =>
  api.put(`/journal/id/${id}`, payload)
export const deleteJournal = (id: string) => api.delete(`/journal/id/${id}`)
