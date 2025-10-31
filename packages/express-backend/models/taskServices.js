import mongoose from "mongoose";
import Task from "./task";

// connects to database
mongoose.set("debug", true);
mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
  }) 
  .catch((error) => console.log(error));

// to find a collection of tasks
function getAllTasks() {
  return User.find({});
}

// find a task by id
function addTask(taskData) {
  const newTask = new Task((taskData));
  return newTask.save();
}

// delete task via id
function deleteTaskById(id) {
  return Task.findByIdAndDelete(id);
}

// export to backend.js
export default {
  getAllTasks,
  addTask,
  deleteTaskById,
};