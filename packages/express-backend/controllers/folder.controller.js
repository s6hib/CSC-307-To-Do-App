import Folder from "../models/folder.model.js";
import Task from "../models/task.model.js";

//Get all folders for authenticated user
export async function getAllFolders(req, res) {
  try {
    const folders = await Folder.find({
      user: req.user._id
    }).sort({ createdAt: 1 });
    console.log("HERE");
    res.status(200).json(folders);
  } catch (error) {
    console.log("THERE");
    console.error("Error fetching folders:", error);
    res.status(500).json({ message: "Error fetching folders" });
  }
}

//Create new folder
export async function createFolder(req, res) {
  try {
    const { name, color } = req.body;

    if (!name || name.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Folder name is required" });
    }

    const folder = new Folder({
      name: name.trim(),
      color: color || "#a8d5a8",
      user: req.user._id
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ message: "Error creating folder" });
  }
}

//Delete a folder
export async function deleteFolderById(req, res) {
  try {
    const { id } = req.params;

    const folder = await Folder.findOne({
      _id: id,
      user: req.user._id
    });

    if (!folder) {
      return res
        .status(404)
        .json({ message: "Folder not found" });
    }

    //Soft delete all tasks
    await Task.updateMany(
      { folder: id, user: req.user._id },
      { deleted: true }
    );

    //Delete  folder
    await Folder.deleteOne({ _id: id });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ message: "Error deleting folder" });
  }
}

//Update folder name/color
export async function updateFolder(req, res) {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const folder = await Folder.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { name, color },
      { new: true, runValidators: true }
    );

    if (!folder) {
      return res
        .status(404)
        .json({ message: "Folder not found" });
    }

    res.status(200).json(folder);
  } catch (error) {
    console.error("Error updating folder:", error);
    res.status(500).json({ message: "Error updating folder" });
  }
}

//Get tasks for a specific folder
export async function getFolderTasks(req, res) {
  try {
    const { id } = req.params;

    //Verify folder belongs to user
    const folder = await Folder.findOne({
      _id: id,
      user: req.user._id
    });

    if (!folder) {
      return res
        .status(404)
        .json({ message: "Folder not found" });
    }

    const tasks = await Task.find({
      folder: id,
      user: req.user._id,
      deleted: false
    }).sort({ date: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching folder tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
}
