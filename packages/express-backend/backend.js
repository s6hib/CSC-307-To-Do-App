// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

// in-memory array for quick testing
let tasks = [
  { _id: 1, task: "Homework", date: "10/30" },
  { _id: 2, task: "Wash Dishes", date: "10/29" },
];
let nextId = 3;

// ---- TASKS API ----

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json({ tasks_list: tasks });
});

// POST new task
app.post("/tasks", (req, res) => {
  const task = req.body;
  if (!task.task || !task.date) {
    return res.status(400).json({ error: "Missing task or date" });
  }
  task._id = nextId++;
  tasks.push(task);
  res.status(201).json(task); // 201 so your front-end picks it up
});

// DELETE task by id
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t._id === id);
  if (index === -1) return res.status(404).end();
  tasks.splice(index, 1);
  res.status(204).end();
});

// ---- FUTURE: JWT + tasks ----
// leave your jwt code commented until you need it

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
