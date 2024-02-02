// verifyModel.js
import { Schema, model } from "mongoose";

const verifySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
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
      default: null,
      trim: true,
    },
    token2: {
      type: String,
      default: null,
    },
    token2used: {
      type: Boolean,
      default: false,
    },
    token2CreatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    capped: { size: 10000000, max: 1000, autoIndexId: true },

  }
);

export const Verify = model("verify", verifySchema, "verify");
