import axios from "axios";

// ----- IMPORTANT: USE YOUR RENDER BACKEND URL -----
const API_URL = "https://challenge-taskmanager.onrender.com/api/";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // MAIN TOKEN
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- AUTH API ----------
export const authAPI = {
  login: (data) => api.post("auth/login/", data),
  register: (data) => api.post("auth/register/", data),
};

// ---------- TASK API ----------
export const taskAPI = {
  getTasks: () => api.get("tasks/"),
  addTask: (data) => api.post("tasks/", data),
  updateTask: (id, data) => api.put(`tasks/${id}/`, data),
  deleteTask: (id) => api.delete(`tasks/${id}/`),
};

export default api;
