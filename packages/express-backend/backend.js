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
  markDone
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

console.log("MongoDB connected");

app.get("/api/tasks", getAllTasks);
app.post("/api/login", login);
app.post("/api/signup", signup);
app.post("/api/tasks", addTask);
app.post("/api/tasks/:id/done", markDone);
app.delete("/api/tasks/:id", deleteTaskById);

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
