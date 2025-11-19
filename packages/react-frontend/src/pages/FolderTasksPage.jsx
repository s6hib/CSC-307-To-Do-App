import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import { useToast } from "./components/ToastProvider.jsx";

export default function FolderTasksPage() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  //Fetch folder info and tasks
  useEffect(() => {
    Promise.all([
      fetch(`/api/folders/${folderId}/tasks`, {
        credentials: "include"
      }),
      fetch("/api/folders", { credentials: "include" })
    ])
      .then(([tasksRes, foldersRes]) =>
        Promise.all([tasksRes.json(), foldersRes.json()])
      )
      .then(([tasksData, foldersData]) => {
        setTasks(Array.isArray(tasksData) ? tasksData : []);
        const currentFolder = foldersData.find(
          (f) => f._id === folderId
        );
        setFolder(currentFolder);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [folderId]);

  //Add new task
  async function addTask() {
    if (!newTaskText.trim() || !newTaskDate) {
      alert("Please enter both task description and date");
      return;
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: newTaskText,
          date: newTaskDate,
          folder: folderId
        })
      });

      if (res.status === 201 || res.status === 200) {
        const newTask = await res.json();
        setTasks([...tasks, newTask.tasks || newTask]);
        setNewTaskText("");
        setNewTaskDate("");
        console.log(show("Task created", "success"));
      }
    } catch (err) {
      console.error("Add task error:", err);
    }
  }

  //Toggle task completion
  async function toggleTask(taskId, currentDone) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !currentDone })
      });

      if (res.status === 200) {
        const updated = await res.json();
        setTasks(
          tasks.map((t) => (t._id === taskId ? updated : t))
        );
      }
    } catch (err) {
      console.error("Toggle task error:", err);
    }
  }

  //Delete a task
  async function deleteTask(taskId) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.status === 204) {
        setTasks(tasks.filter((t) => t._id !== taskId));
        console.log(show("Task deleted", "success"));
      }
    } catch (err) {
      console.error("Delete task error:", err);
    }
  }

  //Edit task text
  async function editTask(taskId, currentText) {
    const newText = prompt("Edit task:", currentText);
    if (!newText || newText === currentText) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newText })
      });

      if (res.status === 200) {
        const updated = await res.json();
        setTasks(
          tasks.map((t) => (t._id === taskId ? updated : t))
        );
        console.log(show("Task updated", "success"));
      }
    } catch (err) {
      console.error("Edit task error:", err);
    }
  }

  // to sort tasks w/ a dropdown menu - automatically set to asc aka closest date
  // automatically set to asc dates so users are able to prioritize those tasks
  const [sortOption, setSortOption] = useState("asc");
  // sorts task based on whatever option the user chooses
  function sortTasks(option) {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    if (option === "today") {
      // user selects 'due today'
      return tasks.filter((t) => {
        const date = new Date(t.date);
        return date >= today && date < tomorrow;
      });
    }

    if (option === "tomorrow") {
      // user selects 'due tmr'
      const temp = new Date(tomorrow);
      temp.setDate(temp.getDate() + 1);
      return tasks.filter((t) => {
        const date = new Date(t.date);
        return date >= tomorrow && date < temp;
      });
    }

    if (option === "week") {
      // user selects 'due next wk'
      return tasks.filter((t) => {
        const date = new Date(t.date);
        return date >= today && date <= nextWeek;
      });
    }

    if (option === "all") return [...tasks]; // user selects 'show all tasks' => in turn, it displays all tasks asc

    if (option === "overdue") {
      return tasks.filter((t) => {
        const date = new Date(t.date);
        return date < today;
      });
    }
    // asc/desc
    return [...tasks].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return option === "asc" ? dateA - dateB : dateB - dateA;
    });
  }

  function handleSortChange(e) {
    const option = e.target.value;
    setSortOption(option);
  }
  const displayedTasks = sortTasks(sortOption);

  if (loading) {
    return (
      <div className="container" style={{ padding: 16 }}>
        <Navbar />
        <p>Loading...</p>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="container" style={{ padding: 16 }}>
        <Navbar />
        <p>Folder not found</p>
        <button onClick={() => navigate("/folders")}>
          Back to Folders
        </button>
      </div>
    );
  }

  // check if smt is overdue
  function overdue(date) {
    const newDate = new Date(date);
    const now = new Date();
    return newDate < now;
  }

  return (
    <div className="container" style={{ padding: 16 }}>
      <Navbar />

      {/* Back Button */}
      <button
        onClick={() => navigate("/folders")}
        style={{
          padding: "8px 16px",
          backgroundColor: "#ddd",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px"
        }}
      >
        ← Back to Folders
      </button>

      {/* Folder Title */}
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
        {folder.name}
      </h2>

      {/* Dropdown Menu */}
      <select
        value={sortOption}
        onChange={handleSortChange}
        style={{
          fontFamily: "Gaegu",
          padding: "8px 12px",
          marginBottom: "16px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "14px",
          cursor: "pointer",
          backgroundColor: "#ddd"
        }}
      >
        <option value="asc">Closest Date</option>
        <option value="desc">Furthest Date</option>
        <option value="today">Due Today</option>
        <option value="tomorrow">Due Tomorrow</option>
        <option value="week">Due This Week</option>
        <option value="all">All Tasks</option>
        <option value="overdue">Overdue Tasks</option>
      </select>

      {/* Tasks Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        {displayedTasks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>
            No tasks yet. Add one below!
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #eee" }}>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    width: "40px"
                  }}
                >
                  Done
                </th>
                <th
                  style={{ padding: "12px", textAlign: "left" }}
                >
                  Task
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    width: "120px"
                  }}
                >
                  Due Date
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    width: "120px"
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedTasks.map((task) => (
                <tr
                  key={task._id}
                  style={{
                    borderBottom: "1px solid #eee",
                    backgroundColor: task.done
                      ? "#f9f9f9"
                      : "white"
                  }}
                >
                  <td style={{ padding: "12px" }}>
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() =>
                        toggleTask(task._id, task.done)
                      }
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer"
                      }}
                    />
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textDecoration: task.done
                        ? "line-through"
                        : overdue(task.date)
                          ? "underline" // underline tasks if overdue!
                          : "none",
                      color: task.done
                        ? "#999"
                        : overdue(task.date)
                          ? "#d32f2f" // makes task red if overdue!
                          : "black",
                      cursor: "pointer"
                    }}
                    onClick={() =>
                      editTask(task._id, task.task)
                    }
                  >
                    {task.task}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: "14px",
                      color: "#666"
                    }}
                  >
                    {new Date(task.date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      }
                    )}
                  </td>

                  <td
                    style={{
                      padding: "12px"
                    }}
                  >
                    <button
                      onClick={() => editTask(task._id)}
                      style={{
                        background: "#ffcccc",
                        border: "1px solid #ff9999",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "#d32f2f",
                        padding: "4px 12px",
                        fontSize: "14px"
                      }}
                      title="Edit"
                    >
                      Edit
                    </button>
                  </td>
                  <td
                    style={{
                      padding: "12px"
                    }}
                  >
                    <button
                      onClick={() => deleteTask(task._id)}
                      style={{
                        background: "#ffcccc",
                        border: "1px solid #ff9999",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "#d32f2f",
                        padding: "4px 12px",
                        fontSize: "14px"
                      }}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Task Form */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}
      >
        <h3
          style={{
            marginTop: 0,
            fontSize: "18px",
            marginBottom: "16px"
          }}
        >
          Add New Task
        </h3>
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "12px",
            flexWrap: "wrap"
          }}
        >
          <input
            type="text"
            placeholder="Task description"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            style={{
              flex: "1",
              minWidth: "200px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
          <input
            type="date"
            value={newTaskDate}
            onChange={(e) => setNewTaskDate(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
          <button
            onClick={addTask}
            style={{
              padding: "10px 20px",
              backgroundColor: "#a8d5a8",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* View Deleted Tasks Link */}
      <button
        onClick={() => navigate("/deleted-tasks")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#ddd",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        View Recently Deleted
      </button>
    </div>
  );
}
