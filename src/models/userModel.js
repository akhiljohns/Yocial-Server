import mongoose, { Schema, model } from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 30,
      set: function (value) {
        return value.toLowerCase();
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: emailRegex,
      set: function (value) {
        return value.toLowerCase();
      },
    },

    password: {
      type: String,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    profilePic: {
      type: String,
      trim: true,
      default:
        "https://www.pngitem.com/pimgs/m/404-4042710_circle-profile-picture-png-transparent-png.png",
    },
    role: {
      type: String,
      default: "user",
    },
    phone: {
      type: String,
      trim: true,
      minlength: 10,
      default: null,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    savedPosts: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "post",
        },
      ],
      default: [],
    },
    online: {
      type: Boolean,
      default: false,
    },

    blocked: {
      type: Boolean,
      default: false,
    },
    blockedUsers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
      ],
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model("user", userSchema);
