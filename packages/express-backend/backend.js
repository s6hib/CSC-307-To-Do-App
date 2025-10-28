import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
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
