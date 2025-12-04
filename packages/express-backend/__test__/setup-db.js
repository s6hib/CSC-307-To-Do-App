import "dotenv/config";
import mongoose from "mongoose";

beforeAll(async () => {
  const uri =
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/myapp_test";

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
