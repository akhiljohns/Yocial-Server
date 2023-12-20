import mongoose, { Schema, model } from "mongoose";


const ConnectionSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    require: true,
  },
  followers: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    default: [],
  },
  following: {
    type: [
        {
            type: mongoose.Types.ObjectId,
            ref: "user",
        }
    ],
    default: [],
  }
});


export const Connection = model("connection", ConnectionSchema);