import Task from "../models/task.model.js";
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
      markDone: false,
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
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ error: "Task not found" });
    return res.status(204).json(deleted);
  } catch (err) {
    console.log("DELETE /api/tasks failed");
    return res
      .status(500)
      .json({ error: "Internal Server Error" });
  }
}

export const markDone = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Task.updateOne(
      { _id: id, done: false },
      { $set: { done: true } }
    );

    if (result.matchedCount === 0) {
      const exist = await Task.exists({ _id: id });
      if (!exist) {
        return res
          .status(404)
          .json({ error: "Task not found" });
      }
      return res
        .status(200)
        .json({ ok: true, alreadyDone: true });
    }

    return res.status(200).json({ ok: true, marked: true });
  } catch (err) {
    console.error(err);
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
  markDone
};
