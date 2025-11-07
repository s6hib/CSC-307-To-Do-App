import "../../css/Table.css";

export default function Table({
  taskData = [],
  removeTask,
  updateTask
}) {
  const rows = Array.isArray(taskData) ? taskData : [];

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Task</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row._id ?? `${row.task}-${i}`}>
            <td>{row.task}</td>
            <td>{row.date}</td>
            <td>
              <button onClick={() => removeTask(i)}>
                Delete
              </button>
              {/* Edit Button */}
              <button
                onClick={() => {
                  const newTask = prompt(
                    "Edit task:",
                    row.task
                  );
                  if (newTask)
                    updateTask(row._id, { task: newTask });
                }}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
