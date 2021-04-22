import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
});

export default mongoose.model("User", Schema);
