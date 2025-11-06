import { useEffect, useState } from "react";
import Table from "./components/Table.jsx";  
import Form from "./components/Form.jsx";    
import Navbar from "./components/Navbar.jsx";

const API_BASE = "http://localhost:8000";     

export default function FoldersPage() {
  const [characters, setCharacters] = useState([
    { task: "Homework", date: "10/30" },
    { task: "Wash Dishes", date: "10/29" },
  ]);

  // READ all
  useEffect(() => {
    fetch(`${API_BASE}/tasks`)
      .then((res) => res.json())
      .then((json) => setCharacters(json?.tasks_list ?? []))
      .catch((err) => console.error("Fetch tasks error:", err));
  }, []);

  // CREATE one
  function postTask(task) {
    return fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
  }

  function addTask(task) {
    postTask(task)
      .then((res) => (res.status === 201 ? res.json() : null))
      .then((created) => {
        if (created) setCharacters((prev) => [...prev, created]);
      })
      .catch((err) => console.error("Add task error:", err));
  }

  function updateTask(id, updates) {
    //return fetch('${API_BASE}/tasks/${id}', {
    return fetch (`${API_BASE}/tasks/${id}` ,{
      method: "PUT",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(updates),
    })
      .then((res) => (res.status === 200 ? res.json() : null))
      .then((updatedTasks) => {
        if (updatedTasks) {
          //update task in state
          setCharacters((prev) =>
            prev.map((task) => (task._id === id ? updatedTasks : task )));

        }
      })
      .catch((err) => console.error("Update task error:", err));
  }

  // DELETE one (by index from table)
  function removeOneTask(index) {
    const _id = characters[index]?._id;

    // If seed row has no _id yet, just remove locally
    if (!_id) {
      setCharacters((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    fetch(`${API_BASE}/tasks/${_id}`, { method: "DELETE" })
      .then((res) => {
        if (res.status === 204) {
          setCharacters((prev) => prev.filter((_, i) => i !== index));
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
      <Navbar/>
      <h2>To-Do Folders</h2>
      <Table characterData={characters} removeCharacter={removeOneTask} updateTask={updateTask} />
      <Form handleSubmit={addTask} />
    </div>
  );
}
