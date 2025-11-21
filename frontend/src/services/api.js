import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// axios instance
const api = axios.create({
  baseURL: API_URL,
});

// attach JWT token correctly
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");   // MAIN TOKEN
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH API
export const authAPI = {
  login: (data) => api.post("/auth/login/", data),
  register: (data) => api.post("/auth/register/", data),
};

// TASK API
export const taskAPI = {
  getTasks: () => api.get("/tasks/"),
  addTask: (data) => api.post("/tasks/", data),
  updateTask: (id, data) => api.put(`/tasks/${id}/`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}/`),
};

export default api;
