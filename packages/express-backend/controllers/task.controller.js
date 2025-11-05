import mongoose from "mongoose";
import Task from "../models/task.model.js";
import "dotenv/config";

// connects to database
// mongoose.set("debug", true);
// mongoose
//   .connect("mongodb://localhost:27017/users", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .catch((error) => console.log(error));

// to find a collection of tasks
export function getAllTasks() {
  return Task.find({});
}

// find a task by id
export function addTask(taskData) {
  const newTask = new Task(taskData);
  return newTask.save();
}

// delete task via id
export function deleteTaskById(id) {
  return Task.findByIdAndDelete(id);
}

function markComplete(id) {
  const task = Task.findById(id);
}

// export to backend.js
export default {
  getAllTasks,
  addTask,
  deleteTaskById
};
