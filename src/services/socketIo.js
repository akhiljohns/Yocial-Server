
const socketIo_Config = (io) => {

    try {
        
        io.on("connect", (socket)=> {
            //establishing connection
            console.log('User has been connected.');

            socket.on("newUser", (roomId)=> {
                
                socket.join(roomId);
                console.log("recieved data in servere socket", socket.id, roomId);

                socket.on("sendMessage", (roomId, message, senderId, cb)=> {
                    console.log("newMessage from socket",roomId,message, senderId);
                    // await sendMessageNotification(senderId, roomId, message)
                        console.log('yoooooo');
                    cb(message);

                    

                    io.to(roomId).emit("recieveMessage", message);
                })

                // socket.on("typing", (typing, senderId, cb)=> {

                //     io.to(roomId).emit("userTyping", {typing, senderId})
                // })

            })


            // socket.on("roomSetup", (userId)=> {
            //     socket.join(userId);
            //     console.log("socket connection established for setting up rooms");

            //     socket.on("newMessageUpdate", (newChat, cb)=> {
            //         io.to(userId).emit("updateChatRooms", newChat)
            //     });


            // })


            




            //disconnecting user
            socket.on("disconnect", ()=>{
                console.log('User disconnected.');
            })
        })


    } catch (error) {
        
    }



};

export default socketIo_Config;