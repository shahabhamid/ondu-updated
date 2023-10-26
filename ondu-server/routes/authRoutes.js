const express = require("express");
const crypto = require("crypto");

const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Expo } = require("expo-server-sdk");
const nodemailer = require("nodemailer");
const controller = require("../controllers/authController");
const expo = new Expo();

router.post("/signin", async (req, res, next) => await controller.signIn(req, res, next));

router.post("/signup", async (req, res, next) => await controller.signUp(req, res, next));

router.post("/changePassword", async (req, res, next) => await controller.changePassword(req, res, next));

router.post("/changeUsername", async (req, res, next) => await controller.changeUsername(req, res, next));

router.get("/getUsers", async (req, res, next) => await controller.getUsers(req, res, next));

router.get("/getUser", async (req, res, next) => await controller.getUser(req, res, next))
// follow user
router.post("/followUser", async (req, res, next) => await controller.followUser(req, res, next))

router.post("/unFollowUser", async (req, res, next) => await controller.unFollowUser(req, res, next))


// nodemailer
async function mailer(recieveremail, code) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,

    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: "talibmashood@gmail.com",
      pass: "qzbjqhvkecstcelu", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "Play your Life", // sender address
    to: `${recieveremail}`, // list of receivers
    subject: "Email Verification", // Subject line
    text: `Your Verification Code is ${code}`, // plain text body
    html: `<b>Your Verification Code is ${code}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

// //
const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const passwordResetToken = generatePasswordResetToken();
    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "talibmashood@gmail.com",
        pass: "qzbjqhvkecstcelu",
      },
    });
    const mailOptions = {
      from: "talibmashood@gmail.com",
      to: user.email,
      subject: "Password reset",
      text: `Reset Password Confirmation is Set`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({ error: "Server error" });
      }
      return res.send({ message: "Password reset email sent" });
    });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
});
router.post("/reset-password", async (req, res) => {
  try {
    const user = await User.findOne({
      passwordResetToken: req.body.passwordResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).send({ error: "Invalid password reset token" });
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return res.send({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
});


router.post("/userdata", (req, res) => {
  const { authorization } = req.headers;
  //    authorization = "Bearer afasgsdgsdgdafas"
  if (!authorization) {
    return res
      .status(401)
      .json({ error: "You must be logged in, token not given" });
  }
  const token = authorization.replace("Bearer ", "");
  // console.log(token);

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "You must be logged in, token invalid" });
    }
    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      res.status(200).send({
        message: "User Found",
        user: userdata,
      });
    });
  });
});
router.post("/verify", (req, res) => {
  console.log("sent by client - ", req.body);
  const { email } = req.body;
  if (!email) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.findOne({ email: email }).then(async (savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
    try {
      let VerificationCode = Math.floor(100000 + Math.random() * 900000);
      let user = [
        {
          email,

          VerificationCode,
        },
      ];
      await mailer(email, VerificationCode);
      res.send({
        message: "Verification Code Sent to your Email",
        // VerificationCode:email,
        udata: user,
      });
    } catch (err) {
      console.log(err);
    }
  });
});
router.post("/verifyfp", (req, res) => {
  console.log("sent by client", req.body);
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      try {
        let VerificationCode = Math.floor(100000 + Math.random() * 900000);
        await mailer(email, VerificationCode);
        console.log("Verification Code", VerificationCode);
        res.send({
          message: "Verification Code Sent to your Email",
          VerificationCode,
          email,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
  });
});


router.post("/resetpassword", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    User.findOne({ email: email }).then(async (savedUser) => {
      if (savedUser) {
        savedUser.password = password;
        savedUser
          .save()
          .then((user) => {
            res.json({ message: "Password Changed Successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return res.status(422).json({ error: "Invalid Credentials" });
      }
    });
  }
});

router.post("/setbio", (req, res) => {
  const { bio, email } = req.body;
  if (!bio || !email) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.find({ bio: bio }).then(async (savedUser) => {
    if (savedUser.length > 0) {
      return res.status(422).json({ error: "Bio already exists" });
    } else {
      User.findOne({ email: email }).then(async (saveduser) => {
        const token = jwt.sign({ _id: saveduser._id }, process.env.JWT_SECRET);
        if (saveduser) {
          saveduser.bio = bio;
          let data = {
            _id: saveduser._id,
            username: saveduser.username,
            name: saveduser.name,
            deviceToken: saveduser.deviceToken,
            email: email,
            profile_pic_name: saveduser.profile_pic_name,
            bio: bio,
            links: saveduser.links,
            followers: saveduser.followers,
            following: saveduser.following,
            allMessages: saveduser.allMessages,
            allEvents: saveduser.allEvents,
            accountEvents: saveduser.accountEvents,
            passwordResetToken: saveduser.passwordResetToken,
            passwordResetExpires: saveduser.passwordResetExpires,
            accountEventsFrom: saveduser.accountEventsFrom,
          };
          saveduser.save();
          res.status(200).send({
            message: "Bio Updated Successfully",
            token,
            user: data,
          });
        } else {
          return res.status(422).json({ error: "Invalid Credentials" });
        }
      });
    }
  });
});
router.post("/setlink", (req, res) => {
  const { links, email } = req.body;
  if (!links || !email) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.find({ links: links }).then(async (savedUser) => {
    if (savedUser.length > 0) {
      return res.status(422).json({ error: "links already exists" });
    } else {
      User.findOne({ email: email }).then(async (saveduser) => {
        const token = jwt.sign({ _id: saveduser._id }, process.env.JWT_SECRET);
        if (saveduser) {
          saveduser.links = links;
          let data = {
            _id: saveduser._id,
            username: saveduser.username,
            name: saveduser.name,
            deviceToken: saveduser.deviceToken,
            email: email,
            profile_pic_name: saveduser.profile_pic_name,
            bio: saveduser.bio,
            links: links,
            followers: saveduser.followers,
            following: saveduser.following,
            allMessages: saveduser.allMessages,
            allEvents: saveduser.allEvents,
            accountEvents: saveduser.accountEvents,
            passwordResetToken: saveduser.passwordResetToken,
            passwordResetExpires: saveduser.passwordResetExpires,
            accountEventsFrom: saveduser.accountEventsFrom,
          };
          saveduser.save();
          res.status(200).send({
            message: "links Updated Successfully",
            token,
            user: data,
          });
        } else {
          return res.status(422).json({ error: "Invalid Credentials" });
        }
      });
    }
  });
});

// get other user

router.post("/otheruserdata", (req, res) => {
  // const { email } = req.body;
  const { username } = req.body;

  // User.findOne({ email: email }).then((saveduser) => {
  User.findOne({ username: username }).then((saveduser) => {
    if (!saveduser) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
    //    console.log(saveduser);

    let data = {
      _id: saveduser._id,
      username: saveduser.username,
      name: saveduser.name,
      deviceToken: saveduser.token,
      // email: saveduser.email,
      profile_pic_name: saveduser.profile_pic_name,
      bio: saveduser.bio,
      links: saveduser.links,
      followers: saveduser.followers,
      following: saveduser.following,
      allmessages: saveduser.allmessages,
      allevents: saveduser.allevents,
      accevents: saveduser.accevents,
      passwordResetToken: saveduser.passwordResetToken,
      passwordResetExpires: saveduser.passwordResetExpires,
      acceventsfrom: saveduser.acceventsfrom,
    };

    // console.log(data);

    res.status(200).send({
      user: data,
      message: "User Found",
    });
  });
});

router.get("/auth/:username", (req, res) => {
  console.log(req.params.username);
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) {
      console.log(err);
    } else if (user) {
      console.log(user);
      res.send(user);
    } else {
      console.log("User not found - AuthRoutes");
      res.send("User not found");
    }
  });
});

router.post("/getuserbyid", (req, res) => {
  const { userid } = req.body;

  User.findById({ _id: userid })
    .then((saveduser) => {
      if (!saveduser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      }
      //    console.log(saveduser);

      let data = {
        _id: saveduser._id,
        username: saveduser.username,
        name: saveduser.name,
        deviceToken: saveduser.deviceToken,
        email: saveduser.email,
        profile_pic_name: saveduser.profile_pic_name,
        bio: saveduser.bio,
        links: saveduser.links,
        followers: saveduser.followers,
        following: saveduser.following,
        allMessages: saveduser.allMessages,
        allEvents: saveduser.allEvents,
        accountEvents: saveduser.accountEvents,
        accountEventsFrom: saveduser.accountEventsFrom,
      };

      // console.log(data);

      res.status(200).send({
        user: data,
        message: "User Found",
      });
    })
    .catch((err) => {
      console.log("error in getuserbyid ");
    });
});


router.post("/checkfollow", (req, res) => {
  const { followfrom, followto } = req.body;
  console.log(followfrom, followto);
  if (!followfrom || !followto) {
    return res.status(422).json({ error: "Invalid Credentials" });
  }
  User.findOne({ email: followfrom })
    .then((mainuser) => {
      if (!mainuser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      } else {
        let data = mainuser.following.includes(followto);
        console.log(data);
        if (data == true) {
          res.status(200).send({
            message: "User in following list",
          });
        } else {
          res.status(200).send({
            message: "User not in following list",
          });
        }
      }
    })
    .catch((err) => {
      return res.status(422).json({ error: "Server Error" });
    });
});

// unfollow user

router.post("/send-notification", (req, res) => {
  const targetUser = req.body.targetUser;
  const message = req.body.message;
  const title = req.body.title;

  // User.findOne({ deviceToken: targetUser }).then((save));
  // Get the target user's device token from the database based on their identifier
  //const deviceToken = getDeviceTokenFromDatabase(targetUser);

  // Create a new push notification and add it to the messages array
  const messages = [
    {
      to: targetUser,
      sound: "default",
      title: title,
      body: message,
      data: {
        title: title,
        message: message,
      },
    },
  ];

  // Send the push notifications
  expo
    .sendPushNotificationsAsync(messages)
    .then((ticketIds) => {
      console.log(`Notifications sent: ${ticketIds}`);
      res.send({ success: true });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: "Failed to send push notification" });
    });
});
router.post("/alluser", (req, res) => {
  User.find({}, (err, events) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(events);
  });
});
module.exports = router;
