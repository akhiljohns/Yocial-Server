import mongoose, { Schema, model } from "mongoose";


const notificationSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        require: true,
    },

    postId: {
        type: mongoose.Types.ObjectId,
    },

    from: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },

    fromUser: {
        type: String
    },

    message: {
        type: String,
        required: true,
    },

    isRead: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {
    timestamps: true,
})

export const Notifications = model("notification", notificationSchema);