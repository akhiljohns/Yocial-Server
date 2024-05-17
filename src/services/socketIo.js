const socketIo_Config = (io) => {
  try {
    io.on("connect", (socket) => {
      //establishing connection
      console.log("User has been connected.");

      socket.on("newUser", (roomId) => {
        socket.join(roomId);
        console.log("recieved data in servere socket", socket.id, roomId);

        socket.on("sendMessage", (roomId, message, senderId, cb) => {
          cb(message);

          io.to(roomId).emit("recieveMessage", message);
        });
      });

      socket.on("videoCall", (callerId, receiverId) => {
        io.emit("startVideoCall", callerId, receiverId);
      });

      socket.on("emailupdate", (userId) => {
        console.log("userId :>> ", userId);
        io.emit("changeEmail", userId);
      });

      socket.on("postInteraction", ({ userId, username, message ,postOwner}) => {
        io.emit("postInteraction", {userId, username, message ,postOwner});
      });

      //disconnecting user
      socket.on("disconnect", () => {
        console.log("User disconnected.");
      });
    });
  } catch (error) {}
};

export default socketIo_Config;
