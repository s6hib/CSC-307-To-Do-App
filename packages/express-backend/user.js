// database for usernames and passwords
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        }
    },
    { collection: "users_list" }
);

const User = mongoose.model("User", userSchema);

export default User;