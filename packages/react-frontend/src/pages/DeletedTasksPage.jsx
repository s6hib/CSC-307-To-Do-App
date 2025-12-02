import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import { useToast } from "./components/ToastProvider.jsx";

export default function DeletedTasksPage() {
  const [tasks, setTasks] = useState([]);
  const { show } = useToast();

  // READ deleted tasks
  useEffect(() => {
    fetch(
      "https://adder-backend.azurewebsites.net/api/tasks/deleted",
      { credentials: "include" }
    )
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
      .catch((err) =>
        console.error("Fetch deleted tasks error: ", err)
      );
  }, []);

  // RESTORE one
  function restoreOneTask(index) {
    const _id = tasks[index]?._id;

    if (!_id) {
      console.log("No _id for task");
      return;
    }

    fetch(
      `https://adder-backend.azurewebsites.net/api/tasks/${_id}/restore`,
      {
        method: "POST",
        credentials: "include"
      }
    )
      .then((res) => {
        if (res.status === 200) {
          setTasks((prev) =>
            prev.filter((_, i) => i !== index)
          );
          show("Task restored", "success");
        } else {
          show("Could not restore task");
        }
      })
      .catch((err) => console.error("Restore error:", err));
  }

  return (
    <div className="container" style={{ padding: 16 }}>
      <Navbar />
      <h2>Deleted Tasks</h2>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((row, i) => (
            <tr key={row._id ?? `${row.task}-${i}`}>
              <td>{row.task}</td>
              <td>
                {new Date(row.date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  }
                )}
              </td>
              <td>
                <button onClick={() => restoreOneTask(i)}>
                  Restore
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
