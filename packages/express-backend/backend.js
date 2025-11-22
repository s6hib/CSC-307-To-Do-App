// backend.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import "dotenv/config";
import {
  getAllFolders,
  createFolder,
  deleteFolderById,
  updateFolder,
  getFolderTasks
} from "./controllers/folder.controller.js";

import {
  login,
  signup,
  logout
} from "./controllers/auth.controller.js";
import {
  getAllTasks,
  addTask,
  deleteTaskById,
  //hardDeleteTaskById,
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
    origin: [
      "http://localhost:5173",
      "https://nice-glacier-0ec51b010.3.azurestaticapps.net"
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],

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

// GET METHOD
app.get("/api/tasks", authenticateUser, getAllTasks);
app.get(
  "/api/tasks/deleted",
  authenticateUser,
  getDeletedTasks
);
app.get("/api/auth/status", authenticateUser, (req, res) => {
  res.json({
    ok: true,
    user: { id: req.user._id, username: req.user.username }
  });
});

// POST METHOD
app.post("/api/login", login);
app.post("/api/signup", signup);
app.post("/api/tasks", authenticateUser, addTask);
app.post("/api/tasks/:id/done", authenticateUser, markDone);
app.post(
  "/api/tasks/:id/restore",
  authenticateUser,
  restoreTask
);
app.post("/api/logout", authenticateUser, logout);

// DELETE METHOD
app.delete("/api/tasks/:id", authenticateUser, deleteTaskById);
/*app.delete(
  "/api/tasks/:id/remove",
  authenticateUser,
  hardDeleteTaskById
);*/
app.get("/api/folders", authenticateUser, getAllFolders);
app.get(
  "/api/folders/:id/tasks",
  authenticateUser,
  getFolderTasks
);
app.post("/api/folders", authenticateUser, createFolder);
app.put("/api/folders/:id", authenticateUser, updateFolder);
app.delete(
  "/api/folders/:id",
  authenticateUser,
  deleteFolderById
);

// PUT/PATCH METHOD
app.put("/api/tasks/:id", authenticateUser, updateTask);
app.patch("/api/tasks/:id", authenticateUser, updateTask);

app.listen(process.env.PORT || port, () => {
  console.log("REST API is listening.");
});
