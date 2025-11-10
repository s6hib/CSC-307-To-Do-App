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
  deleteTaskById,
  updateTask,
  markDone,
  getDeletedTasks,
  restoreTask
} from "./controllers/task.controller.js";
import { authenticateUser } from "./middleware/authentication.js";

const app = express();
const port = 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(cookieParser());
app.use(express.json());

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/myapp";
await mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000
});

console.log("MongoDB connected");

app.get("/api/tasks", authenticateUser, getAllTasks);
app.get(
  "/api/tasks/deleted",
  authenticateUser,
  getDeletedTasks
);
app.post("/api/login", login);
app.post("/api/signup", signup);
app.post("/api/tasks", authenticateUser, addTask);
app.post("/api/tasks/:id/done", authenticateUser, markDone);
app.post(
  "/api/tasks/:id/restore",
  authenticateUser,
  restoreTask
);
app.delete("/api/tasks/:id", authenticateUser, deleteTaskById);

//UPDATE task by id (edit name/date or mark completed)
app.put("/api/tasks/:id", authenticateUser, updateTask);
app.patch("/api/tasks/:id", authenticateUser, updateTask);

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
