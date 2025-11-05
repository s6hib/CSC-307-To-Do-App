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
    status: {
      type: Boolean,
      required: true
    }
  },
  { collection: "tasks_list" }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
