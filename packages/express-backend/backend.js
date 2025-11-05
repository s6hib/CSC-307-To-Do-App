// backend.js
import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import "dotenv/config";

import {
  login,
  signup
} from "./controllers/auth.controller.js";
import {
  getAllTasks,
  addTask,
  deleteTaskById
} from "./controllers/task.controller.js";

const app = express();
const port = 8000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(cookieParser());

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/myapp";
await mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000
});
// in-memory array for quick testing
let tasks = [
  { _id: 1, task: "Homework", date: "10/30" },
  { _id: 2, task: "Wash Dishes", date: "10/29" }
];
let nextId = 3;

// GET all tasks
// app.get("/api/tasks", (req, res) => {
//   res.json({ tasks_list: tasks });
// });
console.log("MongoDB connected");

app.get("/api/tasks", getAllTasks);
app.post("/api/login", login);
app.post("/api/signup", signup);
app.post("/api/tasks", addTask);
app.delete("/api/tasks/:id", deleteTaskById);

/*
// DELETE task by id
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t._id === id);
  if (index === -1) return res.status(404).end();
  tasks.splice(index, 1);
  res.status(204).end();
});
*/

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
