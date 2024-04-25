import {
  chatRoomHelper,
  getChatHelper,
  getRoomWithIds,
  newMessageHelper,
  roomWithUserID,
} from "../helpers/chatHelper.js";
import responseHandler from "../utils/responseHandler.js";

// @desc    Get chats from a room
// @route   /messages/inbox/:roomId
// @access  Users - private
export const getChats = (req, res) => {
  try {
    const { roomId } = req.params;
    getChatHelper(roomId)
      .then((messages) => {
        responseHandler(res, messages);
      })
      .catch((err) => {
        responseHandler(res, err);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};

// @desc    Create or get chatRoom of two
// @route   /messages/inbox/room/:firstId/:secondId
// @access  Users - private
export const setChatRoom = (req, res) => {
  try {
    const { firstId, secondId } = req.params;
    chatRoomHelper([firstId, secondId])
      .then((chatRoom) => {
        responseHandler(res, chatRoom);
      })
      .catch((error) => {
        responseHandler(res, error);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};

// @desc    Get chatRoom of two
// @route   /messages/inbox/room/fetch/:firstId/:secondId
// @access  Users - private
export const getChatRoomWithIds = (req, res) => {
  try {
    const { firstId, secondId } = req.params;
    getRoomWithIds([firstId, secondId])
      .then((room) => {
        responseHandler(res, room);
      })
      .catch((error) => {
        responseHandler(res, error);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};

// @desc    Send new chat
// @route   /messages/inbox/new-message/:roomId
// @access  Users - private
export const sendNewMessage = (req, res) => {
  try {
    const { roomId } = req.params;
    const { senderId, textMessage } = req.body;
    newMessageHelper(roomId, textMessage, senderId)
      .then((response) => {
        responseHandler(res, response);
      })
      .catch((error) => {
        responseHandler(res, error);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};

// @desc    Get rooms with userID
// @route   GET /messages/inbox/get-room/userID/:userId
// @access  Users - private
export const getRoomwithUserID = (req, res) => {
  try {
    const { userId } = req.params;
    roomWithUserID(userId)
      .then((rooms) => {
        responseHandler(res, rooms);
      })
      .catch((err) => {
        responseHandler(res, err);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};
