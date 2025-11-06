import { useEffect, useState } from "react";
import Table from "./components/Table.jsx";
import Form from "./components/Form.jsx";
import Navbar from "./components/Navbar.jsx";

export default function FoldersPage() {
  const [tasks, setTasks] = useState([
    { task: "Homework", date: "10/30" },
    { task: "Wash Dishes", date: "10/29" }
  ]);

  // READ all
  useEffect(() => {
    fetch("/api/tasks")
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
    return fetch("/api/tasks", {
      method: "POST",
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
      })
      .catch((err) => console.error("Add task error:", err));
  }

  // DELETE one (by index from table)
  function removeOneTask(index) {
    const _id = tasks[index]?._id;

    // If seed row has no _id yet, just remove locally
    if (!_id) {
      setTasks((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    fetch(`/api/tasks/${_id}`, { method: "DELETE" })
      .then((res) => {
        if (res.status === 204) {
          setTasks((prev) =>
            prev.filter((_, i) => i !== index)
          );
        } else if (res.status === 404) {
          console.log("Task not found on backend (404).");
        } else {
          console.log("Unexpected status:", res.status);
        }
      })
      .catch((err) => console.error("Delete error:", err));
  }

  return (
    <div className="container" style={{ padding: 16 }}>
      <Navbar />
      <h2>To-Do Folders</h2>
      <Table taskData={tasks} removeTask={removeOneTask} />
      <Form handleSubmit={addTask} />
    </div>
  );
}
