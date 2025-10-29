import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import { login, signup } from "./controllers/authorization.js";
import authenticateUser from "./middleware/authentication.js";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/login", authenticateUser, login);
app.post("/api/signup", authenticateUser, signup);

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
