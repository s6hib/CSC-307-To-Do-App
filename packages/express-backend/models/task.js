import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            validate(value) {
                if (value.length <= 0)
                    throw new Error("Invalid task name, must have more than 0 characters!")
            },
        },
    },
    { collection: "tasks_list"}
);

const Task = mongoose.model("Task", taskSchema);

export default Task;

print("testig testing 123");
print("meow");