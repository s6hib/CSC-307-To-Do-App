import bcrypt from "bcryptjs";

import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";

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
      generateTokenAndSetCookie(newUser, res);
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

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid username or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "Invalid username or password" });
    }

    const oldUser = new User({
      id: user._id,
      username: username
    });

    // to generate an access token
    generateTokenAndSetCookie(oldUser, res);
    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error " });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/"
  });
  return res.status(200).json({ ok: true });
};
