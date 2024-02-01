// verifyModel.js
import { Schema, model } from "mongoose";

const verifySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      default: "",
    },
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
    newEmail: {
      type: String,
      required: true,
      default: "",
      trim: true,
    },
    token2: {
      type: String,
      default: "",
      required: true,
    },
    token2used: {
      type: Boolean,
      default: false,
    },
    token2CreatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    capped: { size: 10000000, max: 1000, autoIndexId: true },

  }
);

export const Verify = model("verify", verifySchema, "verify");
