import mongoose, { Schema, model } from "mongoose";


const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    postId: {
        type: Schema.Types.ObjectId,
        ref: "post",
        required: true
    },

    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 500,
    },

    parentId: {
        type: mongoose.Types.ObjectId,
        ref: "comment"
    },

    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});


export const Comment = model("comment", commentSchema);