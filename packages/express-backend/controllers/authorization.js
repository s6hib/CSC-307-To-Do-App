import bcrypt from "bcryptjs";

import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.js";

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username already taken" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 chars " });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      password: hashedPassword
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    console.log("Error in signup controller", err.message);
    res.status(500).json({ error: "internal Server Error" });
  }
};

/*
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!user || !isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "Invalid username or password" });
    }

    // to generate an access token
    generateTokenAndSetCookie(user._id, res);
    return res.json({
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error " });
  }
};*/


// testing plain text:P
export const login = async (req, res) => {
  try {
    console.log("testing", req.body);

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    const user = await User.findOne({ username });
    console.log("Result of User.findOne:", user);

    if (!user) {
      console.log("User not found in MongoDB:", username);
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordCorrect = password === user.password;
    console.log("password match:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid password" });
    }

    console.log("success", username);
    res.json({ message: "Login success", user });
  } catch (error) {
    console.error("error :():", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
