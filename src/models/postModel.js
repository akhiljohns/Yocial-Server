import mongoose, { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxLength: 100,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    likes: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
      ],
      default: [],
    },

    hidden: {
      type: Boolean,
      default: false,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = model("post", postSchema);
