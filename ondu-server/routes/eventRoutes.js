const express = require("express");
require("dotenv").config();
const moment = require("moment");
const { Expo } = require("expo-server-sdk");

const expo = new Expo();
const router = express.Router();
const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const { createServer } = require("http");
const { Server } = require("socket.io");
const controller = require("../controllers/eventsController");

const httpServer = createServer();

const io = new Server(httpServer, {
  /* options */
});






router.post("/addEvent", async (req, res, next) => await controller.createEvent(req, res, next));

router.get("/events", async (req, res, next) => await controller.getEvents(req, res, next));


router.get("/event/:id", async (req, res, next) => await controller.getEventById(req, res, next))

const expoPushToken = "ExponentPushToken[ThiiGiEPnxQy-yWoqEhPiK]";

io.on("connection", (socket) => {
  console.log("USER CONNECTED - ", socket.id);

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED - ", socket.id);
  });

  socket.on("eventNames", (data) => {
    console.log("eventNames - ", data);
    io.emit("eventName", data);
  });
  socket.on("send-data", (selected) => {
    console.log(selected);
    socket.broadcast.emit("broadcast-selected-data", selected);
  });
  socket.on("send_notification", (data) => {
    //io.emit("send_notification", data);

    console.log(data);

    if (!expo.isExpoPushToken(expoPushToken)) {
      console.error(
        `Push token ${expoPushToken} is not a valid Expo push token`
      );
      return;
    }

    const message = {
      to: expoPushToken,
      sound: "default",
      title: data.title,
      body: data.body,
    };

    expo
      .sendPushNotificationsAsync([message])
      .then((ticket) => {
        console.log(ticket);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});


router.post("/send-data", (req, res) => {
  console.log(req.body);

  const { selected, mess } = req.body;
  selected.forEach((item) => {
    console.log(item.user.deviceToken);
    console.log(mess);
    const messages = [
      {
        to: item.user.deviceToken,
        sound: "default",
        title: "New Event Shared By",
        body: mess,
        data: {
          title: "New Event Shared By",
          message: mess,
        },
      },
    ];

    // Send the push notifications
    expo
      .sendPushNotificationsAsync(messages)
      .then((ticketIds) => {
        console.log(`Notifications sent: ${ticketIds}`);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send({ error: "Failed to send push notification" });
      });
  });

  // Send a success response after the loop has completed processing all items
  res.json({ message: "Data sent successfully" });
});

router.post("/accetpEvent", (req, res) => {
  const { acceptfrom, acceptto } = req.body;
  console.log(acceptfrom, acceptto);
  if (!acceptfrom || !acceptto) {
    return res.status(422).json({ error: "Invalid Credentials" });
  }
  User.findOne({ email: acceptfrom })
    .then((mainuser) => {
      if (!mainuser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      } else {
        if (mainuser.accountEvents.includes(acceptto)) {
          console.log("already following");
        } else {
          mainuser.accountEvents.push(acceptto);
          mainuser.save();
        }
        // console.log(mainuser);

        User.findOne({ email: acceptto })
          .then((otheruser) => {
            if (!otheruser) {
              return res.status(422).json({ error: "Invalid Credentials" });
            } else {
              if (otheruser.accountEventsFrom.includes(acceptfrom)) {
                console.log("Event already followed");
              } else {
                otheruser.accountEventsFrom.push(acceptfrom);
                otheruser.save();
              }
              res.status(200).send({
                message: "Event Accepted",
              });
            }
          })
          .catch((err) => {
            return res.status(422).json({ error: "Server Error" });
          });
      }
    })
    .catch((err) => {
      return res.status(422).json({ error: "Server Error" });
    });
});
router.post("/checkevent", (req, res) => {
  const { acceptfrom, acceptto } = req.body;
  console.log(acceptfrom, acceptto);
  if (!acceptfrom || !acceptto) {
    return res.status(422).json({ error: "Invalid Credentials" });
  }
  User.findOne({ email: acceptfrom })
    .then((mainuser) => {
      if (!mainuser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      } else {
        let data = mainuser.accountEvents.includes(acceptto);
        console.log(data);
        if (data == true) {
          res.status(200).send({
            message: "Event in following list",
          });
        } else {
          res.status(200).send({
            message: "Event not in following list",
          });
        }
      }
    })
    .catch((err) => {
      return res.status(422).json({ error: "Server Error" });
    });
});

// unfollow user
router.post("/unfollowevent", (req, res) => {
  const { acceptfrom, acceptto } = req.body;
  console.log(acceptfrom, acceptto);
  if (!acceptfrom || !acceptto) {
    return res.status(422).json({ error: "Invalid Credentials" });
  }
  User.findOne({ email: acceptfrom })
    .then((mainuser) => {
      if (!mainuser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      } else {
        if (mainuser.accountEvents.includes(acceptto)) {
          let index = mainuser.accountEvents.indexOf(acceptto);
          mainuser.accountEvents.splice(index, 1);
          mainuser.save();

          User.findOne({ email: acceptto })
            .then((otheruser) => {
              if (!otheruser) {
                return res.status(422).json({ error: "Invalid Credentials" });
              } else {
                if (otheruser.accountEventsFrom.includes(acceptfrom)) {
                  let index = otheruser.accountEventsFrom.indexOf(acceptfrom);
                  otheruser.accountEventsFrom.splice(index, 1);
                  otheruser.save();
                }
                res.status(200).send({
                  message: "Event unaccepted",
                });
              }
            })
            .catch((err) => {
              return res.status(422).json({ error: "Server Error" });
            });
        } else {
          console.log("not following");
        }
        // console.log(mainuser);
      }
    })
    .catch((err) => {
      return res.status(422).json({ error: "Server Error" });
    });
});

httpServer.listen(3002);

module.exports = router;
