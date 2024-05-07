import { Router } from "express";
import protect from "../middlewares/authMiddleware.js";

import {
  getChatRoomWithIds,
  getChats,
  getRoomwithUserID,
  sendNewMessage,
  setChatRoom,
} from "../controllers/chatController.js";
const router = Router();

// @desc    Get chats from a room
// @access  Users - private
router.get("/inbox/:roomId", getChats);

// @desc    Create or get chatRoom of two
// @access  Users - private
router.put("/inbox/room/:firstId/:secondId", setChatRoom);
//@user  //@other

// @desc    Get chatRoom of two
// @access  Users - private
router.get("/inbox/room/fetch/:firstId/:secondId", protect, getChatRoomWithIds);

// @desc    Send new chat
// @access  Users - private
router.post("/inbox/new-message/:roomId", sendNewMessage);

// @desc    Get rooms with userID
// @access  Users - private
router.get("/inbox/get-room/userID/:userId", protect, getRoomwithUserID);

// @desc    video call between two users
// @route   GET /messages/inbox/videocall/callerId/receiverId
// @access  Users - private
router.get("/inbox/videocall/:callerId/:receiverId", protect, getRoomwithUserID);

export default router;
