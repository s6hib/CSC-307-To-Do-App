//Form.jsx
import { useState } from "react";

export default function Form({ handleSubmit }) {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!task.trim() || !date.trim()) return;
    const formatDate = new Date(date);
    handleSubmit({ task, date: formatDate }); // to match the data type Date
    setTask("");
    setDate("");
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 12 }}>
      <input
        placeholder="Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        required
      />
      <input
        type="date" // for calendar input!
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
}
