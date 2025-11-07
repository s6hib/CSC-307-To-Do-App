import Task from "../models/task.model.js";
import mongoose from "mongoose";
import "dotenv/config";

// to find a collection of tasks
export async function getAllTasks(req, res) {
  try {
    const items = await Task.find({
      user: req.user._id
    }).lean();
    return res.status(200).json({ tasks_list: items });
  } catch (err) {
    console.log("Couldn't fetch tasks");
    return res
      .status(500)
      .json({ error: "Internal Server Error" });
  }
}

// add task
export async function addTask(req, res) {
  try {
    const task = req.body?.task?.trim();
    const date = req.body?.date?.trim();
    if (!task || !date) {
      return res
        .status(400)
        .json({ error: "Task name and date is required" });
    }

    const newTask = await Task.create({
      task,
      date,
      done: false,
      user: req.user._id
    });
    return res.status(200).json(newTask);
  } catch (err) {
    console.log("Couldn't add task");
    return res
      .status(500)
      .json({ error: "Internal Server Error" });
  }
}

// delete task via id
export async function deleteTaskById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid Id" });
    }

    const deleted = await Task.findByIdAndDelete({
      _id: id,
      user: req.user._id
    });
    if (!deleted)
      return res.status(404).json({ error: "Task not found" });
    return res.status(204).end();
  } catch (err) {
    console.log("DELETE /api/tasks failed");
    return res
      .status(500)
      .json({ error: "Internal Server Error" });
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid Id" });
    }
    const updates = {};
    if (typeof req.body.task === "string")
      updates.task = req.body.task.trim();
    if (typeof req.body.date === "string")
      updates.date = req.body.date.trim();
    if (typeof req.body.done === "boolean")
      updates.done = req.body.done;

    const updated = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: updates },
      { new: true }
    ).lean();

    if (!updated)
      return res.status(404).json({ error: "Task not found" });
    return res.status(200).json(updated);
  } catch (err) {
    console.log("PUT /api/updateTask error");
    return res
      .status(500)
      .json({ error: "Internal Server Error " });
  }
}

export const markDone = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid Id" });
    }

    const result = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id, done: false },
      { $set: { done: true } },
      { new: true }
    ).lean();

    if (updated)
      return res
        .status(200)
        .json({ ok: true, marked: true, task: updated });

    const exist = await Task.exists({
      _id: id,
      user: req.user._id
    });
    if (!exist) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json({ ok: true, marked: true });
  } catch (err) {
    console.error("POST /api/tasks/:id/done error");
    return res
      .status(500)
      .json({ error: "Internal Server Error" });
  }
};

// export to backend.js
export default {
  getAllTasks,
  addTask,
  deleteTaskById,
  updateTask,
  markDone
};
