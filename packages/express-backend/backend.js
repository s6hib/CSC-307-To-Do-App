import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

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
  console.log(`Example app listening at http://localhost:${port}`);
});
