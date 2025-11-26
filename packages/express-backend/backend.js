import mongoose from "mongoose";
import "dotenv/config";
import app from "./app.js";

const port = 8000;

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/myapp";
await mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000
});

console.log("MongoDB connected");

app.listen(process.env.PORT || port, () => {
  console.log("REST API is listening.");
});
