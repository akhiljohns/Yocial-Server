import { ChatRoom } from "../models/chatRoomModel.js";
import { Messages } from "../models/messageModel.js";

// @desc    Get chats from a room
// @route   /messages/inbox/:roomId
// @access  Users - private
export const getChatHelper = (roomId) => {
  return new Promise(async (resolve, reject) => {
    try {
      Messages.find({ roomId: roomId })
        .then((messages) => {
          resolve(messages);
        })
        .catch((err) =>
          reject({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: "Somethings wrong.",
            err,
          })
        );
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Somethings wrong.",
        error,
      });
    }
  });
};

// @desc    Create or get chatRoom of two
// @route   /messages/inbox/room/:firstId/:secondId
// @access  Users - private
export const chatRoomHelper = (userIds) => {
  return new Promise((resolve, reject) => {
    try {
      userIds.sort();
      ChatRoom.findOneAndUpdate(
        { users: userIds },
        { users: userIds },
        { upsert: true, new: true }
      )
        .then((room) => {
          resolve(room);
        })
        .catch((err) => {
          reject({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: "Somethings wrong.",
            err,
          });
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Somethings wrong.",
        error,
      });
    }
  });
};

// @desc    Get chatRoom of two
// @route   /messages/inbox/room/fetch/:firstId/:secondId
// @access  Users - private
export const getRoomWithIds = (IDs) => {
  return new Promise((resolve, reject) => {
    try {
      IDs.sort();
      ChatRoom.findOne({ users: IDs })
        .then((room) => {
          resolve(room);
        })
        .catch((err) => {
          reject({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: "Error getting chat room.",
            err,
          });
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Error getting chat room.",
        error,
      });
    }
  });
};

// @desc    Send new chat
// @route   /messages/inbox/new-message/:roomId
// @access  Users - private
export const newMessageHelper = (roomId, textMessage, senderId) => {
  return new Promise((resolve, reject) => {
    try {
      const newMessage = new Messages({
        senderId: senderId,
        roomId: roomId,
        textMessage: textMessage,
      });

      newMessage
        .save()
        .then(async (response) => {
          const res = await ChatRoom.findOneAndUpdate(
            { _id: roomId },
            {
              $set: {
                lastMessageTime: response?.createdAt,
                lastMessage: textMessage,
              },
            },
            { new: true } // Return the updated document
          );
          resolve(response);
        })
        .catch((err) => {
          reject({
            status: 500,
            error_code: "DB_SAVE_ERROR",
            message: "Error saving message",
            err,
          });
        });
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Get rooms with userID
// @route   GET /messages/inbox/get-room/userID/:userId
// @access  Users - private
export const roomWithUserID = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      ChatRoom.find({ users: userId })
        .sort({ lastMessageTime: -1 })
        .then((rooms) => {
          resolve(rooms);
        })
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Get rooms with userID
// @route   GET /messages/inbox/get-room/userID/:userId
// @access  Users - private
export const startVideoCallHelper = ( callerId,receiverId) => {
  return new Promise((resolve, reject) => {
    try {
      ChatRoom.find({ users: userId })
        .sort({ lastMessageTime: -1 })
        .then((rooms) => {
          resolve(rooms);
        })
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};
