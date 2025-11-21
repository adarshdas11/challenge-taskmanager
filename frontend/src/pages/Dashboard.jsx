import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI } from "../services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [username, setUsername] = useState("");

  // Navigation hook
  const navigate = useNavigate();

  // Edit mode & modal
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Search / filter / theme states
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all | pending | completed

  const fetchTasks = () => {
    taskAPI
      .getTasks()
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTasks();

    // Load username
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    } else {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          try {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.username) setUsername(payload.username);
          } catch (e) {
            console.error("Failed to decode token", e);
          }
        }
      }
    }

    // Load theme
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") setIsDarkMode(true);
  }, []);

  // Apply dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark-mode");
    else root.classList.remove("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showEditModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showEditModal]);

  // ADD TASK
  const addTask = () => {
    if (!title.trim()) return;
    taskAPI
      .addTask({ title, description, status })
      .then(() => {
        setTitle("");
        setDescription("");
        setStatus("pending");
        fetchTasks();
      })
      .catch((err) => console.error(err));
  };

  // UPDATE TASK (called from modal)
  const updateTask = () => {
    if (!title.trim() || !editTaskId) return;

    taskAPI
      .updateTask(editTaskId, { title, description, status })
      .then(() => {
        setShowEditModal(false);
        setIsEditing(false);
        setEditTaskId(null);
        setTitle("");
        setDescription("");
        setStatus("pending");
        fetchTasks();
      })
      .catch((err) => {
        console.error(err);
        setShowEditModal(false);
        setIsEditing(false);
      });
  };

  // DELETE TASK
  const deleteTask = (id) => {
    taskAPI
      .deleteTask(id)
      .then(() => fetchTasks())
      .catch((err) => console.error(err));
  };

  // START EDIT
  const startEdit = (task) => {
    setIsEditing(true);
    setEditTaskId(task.id);
    setTitle(task.title || "");
    setDescription(task.description || "");
    setStatus(task.status || "pending");

    setTimeout(() => {
      setShowEditModal(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 20);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setTimeout(() => {
      setIsEditing(false);
      setEditTaskId(null);
      setTitle("");
      setDescription("");
      setStatus("pending");
    }, 220);
  };

  // ✅ Updated logout using React Router
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("token"); // also remove fallback

    navigate("/login");
  };

  // FILTER + SEARCH
  const normalizedSearch = searchTerm.toLowerCase().trim();
  const hasFilters = normalizedSearch.length > 0 || filterStatus !== "all";

  const visibleTasks = tasks.filter((task) => {
    if (filterStatus === "pending" && task.status !== "pending") return false;
    if (filterStatus === "completed" && task.status !== "completed") return false;

    if (normalizedSearch) {
      const inTitle = task.title.toLowerCase().includes(normalizedSearch);
      const inDesc = (task.description || "").toLowerCase().includes(normalizedSearch);
      if (!inTitle && !inDesc) return false;
    }
    return true;
  });

  return (
    <div className={"app-shell" + (showEditModal ? " modal-open" : "")}>
      {/* Background blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      {/* Top bar */}
      <header className="top-bar">
        <div className="brand">
          <div className="brand-icon">TM</div>
          <span className="brand-name">Task Manager</span>
        </div>

        <div className="top-right">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setIsDarkMode((p) => !p)}
          >
            <span>{isDarkMode ? "🌙" : "☀️"}</span>
            <span style={{ marginLeft: 6 }}>{isDarkMode ? "Dark" : "Light"}</span>
          </button>

          <div className="user-chip">
            <div className="user-avatar">
              {(username || "U").charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{username || "User"}</span>
            <button className="btn-ghost" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="edit-modal-overlay" role="dialog" aria-modal="true">
          <div className="edit-modal card">
            <h2 style={{ marginBottom: 12 }}>{isEditing ? "Edit Task" : "New Task"}</h2>

            <div className="field">
              <label>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title..."
              />
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes or checklist..."
              />
            </div>

            <div className="field">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                className="btn-primary full-width"
                onClick={updateTask}
                type="button"
              >
                Update Task
              </button>

              <button
                className="btn-outline full-width"
                onClick={cancelEdit}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main dashboard layout */}
      <main className="dashboard-main">
        {/* Form on left */}
        <section
          className={
            "card task-form-card" + (showEditModal ? " dimmed" : "")
          }
        >
          <h2 className="card-title">{isEditing && !showEditModal ? "Edit task" : "New task"}</h2>

          <div className="field">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Plan tomorrow’s workout…"
            />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a short note or checklist…"
            />
          </div>

          <div className="field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button
            className="btn-primary full-width"
            onClick={isEditing && !showEditModal ? updateTask : addTask}
          >
            {isEditing && !showEditModal ? "Update Task" : "Save Task"}
          </button>

          {isEditing && !showEditModal && (
            <button
              className="btn-outline full-width"
              style={{ marginTop: "10px" }}
              onClick={() => {
                setIsEditing(false);
                setEditTaskId(null);
                setTitle("");
                setDescription("");
                setStatus("pending");
              }}
            >
              Cancel Edit
            </button>
          )}
        </section>

        {/* Tasks List */}
        <section className={"card tasks-card" + (showEditModal ? " dimmed" : "")}>
          <div className="tasks-header">
            <h2>Your tasks</h2>
            <span className="tasks-count">
              {tasks.length === 0
                ? "No tasks yet — start by adding one."
                : `${tasks.length} task${tasks.length > 1 ? "s" : ""} total`}
            </span>
          </div>

          {/* Search + Filters */}
          <div className="tasks-controls">
            <div className="tasks-search">
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-chips">
              <button
                type="button"
                className={
                  "filter-chip" + (filterStatus === "all" ? " filter-chip-active" : "")
                }
                onClick={() => setFilterStatus("all")}
              >
                All
              </button>
              <button
                type="button"
                className={
                  "filter-chip" +
                  (filterStatus === "pending" ? " filter-chip-active" : "")
                }
                onClick={() => setFilterStatus("pending")}
              >
                Pending
              </button>
              <button
                type="button"
                className={
                  "filter-chip" +
                  (filterStatus === "completed" ? " filter-chip-active" : "")
                }
                onClick={() => setFilterStatus("completed")}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Visible tasks or empty */}
          {visibleTasks.length === 0 ? (
            <p className="tasks-empty">
              {tasks.length === 0
                ? "When you add tasks, they’ll show up here with their status."
                : hasFilters
                ? "No tasks match your search or filters."
                : "No tasks to show."}
            </p>
          ) : (
            <div className="tasks-list">
              {visibleTasks.map((task) => (
                <div
                  key={task.id}
                  className={
                    "task-row " + (editTaskId === task.id && showEditModal ? "task-row-active" : "")
                  }
                >
                  <div className="task-main">
                    <div className="task-title">{task.title}</div>
                    {task.description && (
                      <div className="task-description">{task.description}</div>
                    )}
                    <span
                      className={
                        "task-status " +
                        (task.status === "completed"
                          ? "task-status-completed"
                          : "task-status-pending")
                      }
                    >
                      {task.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="btn-outline"
                      onClick={() => startEdit(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn-danger"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}