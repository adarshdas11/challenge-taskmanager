import axios from "axios";

const api = axios.create({
  baseURL: "https://challenge-taskmanager.onrender.com/api", // <-- FIXED
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post("/auth/login/", data),
  register: (data) => api.post("/auth/register/", data),
};

export const taskAPI = {
  getTasks: () => api.get("/tasks/"),
  addTask: (data) => api.post("/tasks/", data),
  updateTask: (id, data) => api.put(`/tasks/${id}/`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}/`),
};

export default api;
