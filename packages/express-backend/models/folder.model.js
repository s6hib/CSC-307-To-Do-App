import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      default: "#a8d5a8"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true, collection: "folders" }
);

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;
