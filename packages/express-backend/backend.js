import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import "dotenv/config";

import { login, signup } from "./controllers/authorization.js";
import { authenticateUser } from "./middleware/authentication.js";

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

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp";
await mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000
});
console.log("MongoDB connected");

app.post("/api/login", login);
app.post("/api/signup", signup);

/*
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // testing
  if (username = "guest" && password = "123") {
    const token = generateAccessToken(username);
    res
  }
})*/

app.post("/tasks", (req, res) => {
  //const taskToAdd = ...;
  // for tasks
});

app.delete("/tasks", (req, res) => {
  // to delete tasks
});

app.post("/tasks/:subtasks", (req, res) => {
  //const subtaskToAdd = ...;
  // for subtasks within tasks
});

app.delete("/tasks/:subtasks", (req, res) => {
  // to delete subtasks?
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
