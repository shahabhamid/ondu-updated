const express = require("express");
const port = process.env.PORT || 3000;
const cors = require("cors");
const multer = require("multer");
const app = express();

const bodyParser = require("body-parser");

require("./db");
require("./models/user");
require("./models/Message");
require("./models/events");
require("./models/image");

const authRoutes = require("./routes/authRoutes");
const requireToken = require("./middlewares/AuthTokenRequired");
const uploadMediaRoutes = require("./routes/uploadMediaRoutes");
const messageRoutes = require("./routes/messageRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {
  /* options */
});

app.use(cors());
app.use(bodyParser.json());
app.use(authRoutes);
app.use(uploadMediaRoutes);
app.use(messageRoutes);
app.use(eventRoutes);

const { addMessage, getChatHistory } = require("./models/Message");

app.get("/", requireToken, (req, res) => {
  // console.log(req.user);
  res.send(req.user);
});

io.on("connection", (socket) => {
  // console.log("USER CONNECTED - ", socket.id);

  // socket.on("sendMessage", async (messageData) => {
  //   try {
  //     const { senderid, message, recieverid, type } = messageData;
  //     const chat = await addMessage({ senderid, message, recieverid, type });
  //     const chatHistory = await getChatHistory({
  //       senderid,
  //       recieverid,
  //     });
  //     io.emit("chatHistory", chatHistory);

  //     const receiverExpoToken = await getExpoToken(receiver);
  //     if (receiverExpoToken) {
  //       expoPushClient.sendPushNotificationAsync({
  //         to: receiverExpoToken,
  //         sound: "default",
  //         title: "New Message",
  //         body: `${senderid} sent you a ${
  //           type === "text" ? "message" : "image"
  //         }`,
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  socket.on("disconnect", () => {
    //  console.log("USER DISCONNECTED - ", socket.id);
  });

  socket.on("join_room", (data) => {
    // console.log("USER WITH ID - ", socket.id, "JOIN ROOM - ", data.roomid);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    console.log("MESSAGE RECEIVED - ", data);

    io.emit("receive_message", data);
  });
  socket.on("sendNoti", (data) => {
    console.log("MESSAGE RECEIVED - ", data);

    io.emit("recieveNoti", data);
  });
});
const sendNotification = (receiver, message) => {
  expoPushClient.sendPushNotificationsAsync([
    {
      to: receiver,
      sound: "default",
      body: message,
      data: { message },
    },
  ]);
};
httpServer.listen(3001);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
