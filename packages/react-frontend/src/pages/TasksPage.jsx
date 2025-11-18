import { useEffect, useState } from "react";
import Table from "./components/Table.jsx";
import { useToast } from "./components/ToastProvider.jsx";

export default function FoldersPage() {
  const { show } = useToast();
  const [tasks, setTasks] = useState([]);
  const [sortTask, setSortTask] = useState(true);

  // READ all
  useEffect(() => {
    fetch("https://adder-backend.azurewebsites.net/api/tasks", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((json) => {
        const list = Array.isArray(json)
          ? json
          : Array.isArray(json?.tasks_list)
            ? json.tasks_list
            : [];
        setTasks(list);
      })
      .catch((err) => console.error("Fetch tasks error:", err));
  }, []);

  // CREATE one
  function postTask(task) {
    return fetch("https://adder-backend.azurewebsites.net/api/tasks", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    });
  }

  async function addTask(task) {
    return postTask(task)
      .then((res) => {
        if (res.status === 201 || res.status === 200)
          return res.json();
        throw new Error(`${res.status}`);
      })
      .then((json) => {
        const created = json?.tasks ?? json;
        if (created) setTasks((prev) => [...prev, created]);
        console.log(show("Task created", "success"));
      })
      .catch((err) => console.error("Add task error:", err));
  }

  // UPDATE one
  async function updateTask(id, updates) {
    return fetch(`https://adder-backend.azurewebsites.net/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    })
      .then((res) => (res.status === 200 ? res.json() : null))
      .then((updatedTasks) => {
        if (updatedTasks) {
          setTasks((prev) =>
            prev.map((task) =>
              task._id === id ? updatedTasks : task
            )
          );
          console.log(show("Task updated", "success"));
        }
      })
      .catch((err) => console.error("Update task error:", err));
  }

  // DELETE one (by index from table)
  function removeOneTask(index) {
    const _id = tasks[index]?._id;

    // If seed row has no _id yet, just remove locally
    if (!_id) {
      setTasks((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    fetch(`https://adder-backend.azurewebsites.net/api/tasks/${_id}`, {
      method: "DELETE",
      credentials: "include"
    })
      .then((res) => {
        if (res.status === 204) {
          setTasks((prev) =>
            prev.filter((_, i) => i !== index)
          );
          console.log(show("Task deleted", "success"));
        } else if (res.status === 404) {
          console.log("Task not found on backend (404).");
        } else {
          console.log("Unexpected status:", res.status);
        }
      })
      .catch((err) => console.error("Delete error:", err));
  }

  // function to filter/sort by the due date
  function sortByDate() {
    const sortedList = [...tasks].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortTask ? dateA - dateB : dateB - dateA;
    });

    setTasks(sortedList);
    setSortTask(!sortTask);
  }

  return (
    <div className="container" style={{ padding: 16 }}>
      <button onClick={sortByDate} style={{ marginBottom: 12 }}>
        Sort by {sortTask ? "Closest" : "Furthest"} Date{" "}
      </button>
      <Table
        taskData={tasks}
        removeTask={removeOneTask}
        updateTask={updateTask}
        title="unnamed"
        addTask={addTask}
      />
      {/*<Form handleSubmit={addTask} /> */}
    </div>
  );
}
