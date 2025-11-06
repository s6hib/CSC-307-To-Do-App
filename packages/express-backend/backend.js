// backend.js
import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import "dotenv/config";

import { login, signup } from "./controllers/authorization.js";
import { authenticateUser } from "./middleware/authentication.js";
//import userServices from "./userServices";


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

/*const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp";
await mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000
});
*/
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp";

try {
  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  });
  console.log("MongoDB connected");
} catch (err) {
  console.warn(" MongoDB not running — continuing with in-memory tasks.");
}


// in-memory array for quick testing
let tasks = [
  { _id: 1, task: "Homework", date: "10/30", completed: false },
  { _id: 2, task: "Wash Dishes", date: "10/29", completed: false }
];
let nextId = 3;

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json({ tasks_list: tasks });
});
console.log("MongoDB connected");

app.post("/api/login", login);
app.post("/api/signup", signup);

/*


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
*/

// POST new task
app.post("/tasks", (req, res) => {
  const task = req.body;
  if (!task.task || !task.date) {
    return res
      .status(400)
      .json({ error: "Missing task or date" });
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

//UPDATE task by id (edit name/date or mark completed)
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t._id == id);
  if (index === -1) return res.status(404).json({error: "Task not found"});
  
  const updates = req.body;
  //merge new data into existing task
  tasks[index] = { ...tasks[index], ...updates };
  res.status(200).json(tasks[index]);
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

// CRUD relative to user db
/*
app.get("/users", (req, res) => {
  const {username} = req.query;
  userServices
    .getUser(username)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).send(error);
    })
})

app.get("/users:id", (req, res) => {
  const id = req.params["id"];
  userServices
    .findUserById(id)
    .then((user) => {
      if (!user) res.status(404).send("User not found :(");
      else res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).send(error);
    })
});

app.post("/users", (req, res) => {
  const newUser = req.body;
  userServices
    .addUser(newUser)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(400).send(error);
    })
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  userServices
    .deleteUserById(id)
    .then((result) => {
      if (!result) res.status(404).send("user not found");
      else res.status(204).end();
    })
    .catch((error) => {
      res.status(500).send(error);
    })
});
*/

// ---- FUTURE: JWT + tasks ----
// leave your jwt code commented until you need it
/*
// to generate an access token
function generateAccessToken(username) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token);
      }
    );
  });
}

// to authenticate user using jwt
function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).end();
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET,
      (error, decoded) => {
        if (decoded) { next(); }
        else { res.status(401).end(); }
      }
    );
  }
}


// authenticate user
app.post("/users", authenticateUser, (req, res) => {
  const userToAdd = req.body;
  Users.addUser(userToAdd).then((result) =>
    res.status(201).send(result)
  );
});
*/
