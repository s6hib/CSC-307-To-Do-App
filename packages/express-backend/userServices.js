import mongoose from "mongoose";
import User from "./user";

// connects to database
mongoose.set("debug", true);
mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
  }) 
  .catch((error) => console.log(error));

// to find a specific user by username
function getUser(username) {
  if (username) {
    return User.findOne({ username });
  }
  return User.find();
}

// find a user by id
function findUserById(id) {
  return User.findById(id);
}

// add a new user
function addUser(user) {
  const newUser = new User(user);
  return newUser.save();
}

// delete user via id
function deleteUserById(id) {
  return User.findByIdAndDelete(id);
}

// export to backend.js
export default {
  getUser,
  addUser,
  findUserById,
  deleteUserById,
};