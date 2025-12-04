import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length <= 0)
          throw new Error(
            "Invalid task name, must have more than 0 characters!"
          );
      }
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: false,
      index: true
    },
    date: {
      type: Date,
      required: true
    },
    done: {
      type: Boolean,
      default: false,
      index: true
    },
    deleted: {
      type: Boolean,
      default: false,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    repeat: {
      type: String,
      enum: ["none", "daily", "weekly"],
      default: "none"
    }
  },
  { timestamps: true, collection: "tasks_list" }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
