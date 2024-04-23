import mongoose, { Schema, model } from "mongoose";



const messageSchema = new Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        require: true,
    },

    roomId: {
        type: mongoose.Types.ObjectId,
        ref: "chatRoom",
        require: true,
    },

    textMessage: {
        type: String,
        trim: true,
    },

    image: {
        type: String,
        trim: true,
    }
},{
    timestamps: true,
})


export const Messages = model("Message", messageSchema);