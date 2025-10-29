//Form.jsx
import { useState } from "react";

export default function Form({ handleSubmit }) {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!task.trim() || !date.trim()) return;
    handleSubmit({ task, date });
    setTask("");
    setDate("");
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 12 }}>
      <input placeholder="Task" value={task} onChange={(e)=>setTask(e.target.value)} />
      <input placeholder="Date" value={date} onChange={(e)=>setDate(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}
