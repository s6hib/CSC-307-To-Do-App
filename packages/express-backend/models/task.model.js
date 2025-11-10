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
    date: {
      type: String, // switch to Date for filtering in the future
      required: true
    },
    done: {
      type: Boolean,
      default: false,
      index: true
    },
    deleted: { // deleted field (Boolean, default flase) to track soft deletes
      type: Boolean,
      default: false,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true, collection: "tasks_list" }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
