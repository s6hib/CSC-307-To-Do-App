//Form.jsx
import { useState } from "react";

import "../../css/Form.css";

export default function Form({ handleSubmit, onCancel }) {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");

  // function onDateChange(e) {
  //   let v = e.target.value.replace(/\D/g, "").slice(0, 4);
  //   if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
  //   setDate(v);
  // }
  async function submit(e) {
    e.preventDefault();

    if (!task.trim() || !date.trim())
      return console.log("Date Invalid Format");
    handleSubmit({ task, date });

    const formatDate = new Date(date);
    handleSubmit({ task, date: formatDate }); // to match the data type Date
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
          type="date"
          placeholder="Date"
          value={date}
          //onChange={onDateChange}
          onChange={(e) => setDate(e.target.value)}
          required
          className="due-input"
        />

        <div className="form-buttons">
          <button type="submit">Add</button>
          <button type="button" onClick={cancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
