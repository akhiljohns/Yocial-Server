// verifyModel.js
import { Schema, model } from "mongoose";

const verifySchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Verify = model("verify", verifySchema,"verify");
