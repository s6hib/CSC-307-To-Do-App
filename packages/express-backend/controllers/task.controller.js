import Task from "../models/task.model.js";
import mongoose from "mongoose";
import "dotenv/config";

//add task
export async function addTask(req, res) {
  try {
    const task = req.body?.task?.trim();
    const date = req.body?.date?.trim();
    const folder = req.body?.folder; 
    const repeat = req.body?.repeat || 'none';

    if (!task || !date) {
      return res
        .status(400)
        .json({ error: "Task name and date is required" });
    }

    const newTask = await Task.create({
      task,
      date,
      folder,
      repeat,
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

//delete task via id
export async function deleteTaskById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid Id" });
    }

    const deleted = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: { deleted: true } },
      { new: true }
    ).lean();
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

// to permanently delete task via id (above only soft deletes 4 the archive)
export async function hardDeleteTaskById(req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "invalid id!" });
    }
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      user: req.user._id,
      deleted: true
    });
    if (!deletedTask)
      return res
        .status(404)
        .json({ error: "task not found !" });
    return res.status(204).end();
  } catch (err) {
    console.log("hard delete failed.");
    return res
      .status(500)
      .json({ error: "internal server error" });
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

    const updated = await Task.findOneAndUpdate(
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

//get deleted tasks
export async function getDeletedTasks(req, res) {
  try {
    const items = await Task.find({
      user: req.user._id,
      deleted: true
    }).lean();
    return res.status(200).json({ tasks_list: items });
  } catch (err) {
    console.log("Couldn't fetch deleted tasks");
    return res
      .status(500)
      .json({ error: "Internal Server Error" });
  }
}

// restore deleted task
export async function restoreTask(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid Id" });
    }

    const restored = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: { deleted: false } },
      { new: true }
    ).lean();
    if (!restored)
      return res.status(404).json({ error: "Task not found" });
    return res.status(200).json(restored);
  } catch (err) {
    console.log("Restore task failed");
    return res
      .status(500)
      .json({ error: "Internal Server Error" });
  }
}

// export to backend.js
export default {
  addTask,
  deleteTaskById,
  hardDeleteTaskById,
  updateTask,
  markDone,
  getDeletedTasks,
  restoreTask
};
