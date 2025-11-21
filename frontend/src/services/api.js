import axios from "axios";

// 🔥 Correct Render backend API URL
const API_URL = "https://challenge-taskmanager.onrender.com/api";

// axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (data) => api.post("/auth/login/", data),
  register: (data) => api.post("/auth/register/", data),
};

// Task APIs
export const taskAPI = {
  getTasks: () => api.get("/tasks/"),
  addTask: (data) => api.post("/tasks/", data),
  updateTask: (id, data) => api.put(`/tasks/${id}/`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}/`),
};

export default api;
