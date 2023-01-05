var express = require("express");
let multer = require("multer");
let nodemailer = require("nodemailer");
let User = require("../models/user");
var router = express.Router();
let auth = require("../meddelwares/auth");
// multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// find sign up form
router.get("/sign-up", (req, res, next) => {
  return res.render("signup");
});
// find sign ip form
router.get("/sign-in", (req, res, next) => {
  return res.render("login");
});
// submit sign up form
router.post("/sign-up", upload.single("profileImage"), (req, res, next) => {
  req.body.profileImage = req.file.filename;
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect("/users/sign-in");
  });
});

// submit sign up form
router.post("/sign-in", (req, res, next) => {
  // console.log(req.body);
  let { email, password } = req.body;
  if (!email && !password) {
    return res.redirect("/users/sign-in");
  }
  // email verified
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect("/users/sign-in");
    }
    // password compare
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        return res.redirect("/users/sign-in");
      }
      // persist loged in user information
      req.session.userId = user.id;
      return res.redirect("/");
    });
  });
});

// forgate password send message
router.get("/forget-password", (req, res, next) => {
  return res.render("forgatePassword");
});

router.post("/forget-password", (req, res, next) => {
  let email1 = req.body.email1;
  let email2 = req.body.email2;
  let message = req.body.message;
  // console.log("forgate route", email1, message);
  var tansporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.user,
      pass: process.env.password,
    },
  });
  var mailOptions = {
    from: process.env.user,
    to: email1,
    subject: "try to send messahe",
    text: message,
  };

  console.log(mailOptions);

  tansporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email send" + info.response);
    }
  });
});

// logout
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  return res.redirect("/");
});
module.exports = router;
