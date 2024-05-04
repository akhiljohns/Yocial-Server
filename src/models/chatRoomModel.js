import mongoose, { Schema, model } from "mongoose";


const chatRoomSchema = new Schema({
    users: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: "user"
            }
        ],
        require: true,
    },
    theme: {
        type: String,
    },
    lastMessage: {
        type: String,
    },
    lastMessageTime: {
        type: Date,
    }
}, {
    timestamps: true,
})


export const ChatRoom = model("chatRoom", chatRoomSchema);