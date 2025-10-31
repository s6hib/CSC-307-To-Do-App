import mongoose from "mongoose";

const subtaskSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length <= 0)
                throw new Error("Invalid, must be more than 0 chars!")
        }
    }
})

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
        date: {
            type: String, // switch to Date for filtering in the future
            required: true,
        },
        subtasks: [subtaskSchema],
    },
    { collection: "tasks_list"}
);

const Task = mongoose.model("Task", taskSchema);

export default Task;