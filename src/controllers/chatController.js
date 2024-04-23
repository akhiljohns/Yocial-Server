import {
  chatRoomHelper,
  getChatHelper,
  getRoomWithIds,
  newMessageHelper,
  roomWithUserID,
} from "../helpers/chatHelper.js";



// @desc    Get chats from a room
// @route   /messages/inbox/:roomId
// @access  Users - private
export const getChats = (req, res) => {
    try {
        const {roomId} = req.params;
        getChatHelper(roomId).then((messages)=> {
            res.status(200).send(messages);
        }).catch((err)=> {
            res.status(500).send(err);
        });
    } catch (error) {
        res.status(500).send(error);
    }
};



// @desc    Create or get chatRoom of two
// @route   /messages/inbox/room/:firstId/:secondId
// @access  Users - private
export const setChatRoom = (req, res) => {
    try {
        const {firstId, secondId} = req.params;
        chatRoomHelper([firstId, secondId]).then((chatRoom) => {
            res.status(200).send(chatRoom)
        }).catch((error) => {
            res.status(500).send(error);
        })
    } catch (error) {
        res.status(500).send(error);
    }
}

// @desc    Get chatRoom of two
// @route   /messages/inbox/room/fetch/:firstId/:secondId
// @access  Users - private
export const getChatRoomWithIds = (req, res) => {
    try {
        const {firstId, secondId} = req.params;
        getRoomWithIds([firstId, secondId]).then((room) =>{
            res.status(200).send(room);
        }).catch((error) => {
            res.status(500).send(error);
        })
    } catch (error) {
        res.status(500).send(error);
    }
}


// @desc    Send new chat
// @route   /messages/inbox/new-message/:roomId
// @access  Users - private
export const sendNewMessage = (req, res) => {
    try {
        const {roomId} = req.params;
        const {senderId, textMessage} = req.body;
        newMessageHelper(roomId, textMessage, senderId).then((response)=> {
            res.status(200).send(response);
        }).catch((error) => {
            res.status(500).send(error);
        })
    } catch (error) {
        res.status(500).send(error);
    }
};

// @desc    Get rooms with userID
// @route   GET /messages/inbox/get-room/userID/:userId
// @access  Users - private
export const getRoomwithUserID = (req, res) => {
    try {
    const { userId } = req.params;
        roomWithUserID(userId).then((rooms)=> {
            res.status(200).send(rooms);
        }).catch((err)=> {
            res.status(500).send(err);
        })
    } catch (error) {
        res.status(500).send(error);
    }    
}
