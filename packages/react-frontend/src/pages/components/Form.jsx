//Form.jsx
import { useState } from "react";

import "../../css/Form.css";

export default function Form({ handleSubmit, onCancel }) {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!task.trim() || !date.trim()) return;
    handleSubmit({ task, date });
    setTask("");
    setDate("");
  }

  function cancel() {
    setTask("");
    setDate("");
    onCancel?.();
  }

  return (
    <form
      onSubmit={submit}
      style={{ marginTop: 12 }}
      className="form"
    >
      <div className="form-row">
        <div className="line input-line">
          <input
            className="task-input"
            placeholder="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />
        </div>
        <input
          placeholder="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="due-input"
        />
      </div>
      <div className="form-buttons">
        <button type="submit">Add</button>
        <button type="button" onClick={cancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
