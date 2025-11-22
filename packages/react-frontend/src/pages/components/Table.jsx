import { useState } from "react";

import "../../css/Table.css";
import Form from "./Form.jsx";

export default function Table({
  taskData = [],
  removeTask,
  updateTask,
  title,
  addTask = () => {}
}) {
  const rows = Array.isArray(taskData) ? taskData : [];
  const [showForm, setShowForm] = useState(false);

  async function handleFormSubmit({ task, date }) {
    addTask({ task, date });
    setShowForm(false);
  }

  return (
    <div className="todo-board">
      <h1 className="board-title">{title || "unnamed"}</h1>
      <div className="table">
        {rows.map((row, i) => (
          <div
            key={row._id ?? `${row.task}-${i}`}
            className="todo-row"
          >
            <label
              className="square checkbox"
              aria-label="mark done"
            >
              <input
                type="checkbox"
                checked={!!row.done}
                onChange={() =>
                  updateTask(row._id, { done: !row.done })
                }
              />
              <span className="checkmark" />
            </label>

            {/* line with task text */}
            <div className={`line ${row.done ? "done" : ""}`}>
              <span className="task-text">{row.task}</span>
            </div>

            {/* due date on the right */}
            <div className="due">
              {new Date(row.date).toLocaleDateString("en-US", {
                timeZone: "America/Los_Angeles",
                year: "numeric",
                month: "short",
                day: "numeric"
              })}{" "}
            </div>

            <button
              onClick={() => {
                const newTask = prompt("Edit task:", row.task);
                if (newTask)
                  updateTask(row._id, { task: newTask });
              }}
            >
              edit
            </button>

            <button
              className="square delete"
              aria-label="delete task"
              onClick={() => removeTask(i)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="table-footer">
        {!showForm ? (
          <button
            className="new-task"
            onClick={() => setShowForm(true)}
          >
            + new to-do
          </button>
        ) : (
          <div className="add-form-wrap">
            <Form
              handleSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
