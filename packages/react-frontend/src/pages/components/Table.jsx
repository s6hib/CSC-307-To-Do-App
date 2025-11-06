//Table.jsx
export default function Table({ characterData, removeCharacter, updateTask}) {
  return (
    <table>
      <thead>
        <tr><th>Task</th><th>Date</th><th>Actions</th></tr>
      </thead>
      <tbody>
        {characterData.map((row, i) => (
          <tr key={row._id ?? `${row.task}-${i}`}>
            <td>{row.task}</td>
            <td>{row.date}</td>
            <td>
              {/* Edit Button */}
              <button
                onClick={() => {
                  const newTask = prompt("Edit task:", row.task);
                  if (newTask) updateTask(row._id, { task: newTask});
                }}
              >Edit</button>
              <button onClick={() => removeCharacter(i)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}