var express = require("express");
let multer = require("multer");
let nodemailer = require("nodemailer");
let User = require("../models/user");
let Otp = require("../models/otp");
var router = express.Router();
var flash = require("connect-flash");
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
  var error = req.flash("error")[0];
  return res.render("login", { error });
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
    req.flash("error", "Email/Password is required");
    return res.redirect("/users/sign-in");
  }
  // email verified
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "This Email is not exists");
      return res.redirect("/users/sign-in");
    }
    // password compare
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash("error", " password is Invalid");
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
  var error = req.flash("error")[0];
  return res.render("forgatePassword", { error });
});

//
router.post("/forget-password", (req, res, next) => {
  let email = req.body.email1;
  Otp.deleteMany({}, (err, opt) => {
    if (err) return next(err);
  });
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", " This Email is not exists");
      return res.redirect("/users/forget-password");
    }
    req.body.email = user.email;
    req.body.otp = Math.floor(Math.random(1000) * 10000);
    req.body.extime = new Date().getTime() + 300 * 1000;
    //create otp collection
    Otp.create(req.body, (err, otp) => {
      if (err) return next(err);
      res.redirect("/users/otp/" + otp.email);
    });
  });
});

router.get("/otp/:email", async (req, res, next) => {
  var otp = await Otp.findOne({ email: req.params.email });
  // console.log(otp, "email otp");
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.user,
      pass: process.env.password,
    },
    // === add this === //
    tls: { rejectUnauthorized: false },
  });
  var mailOptions = {
    from: process.env.user,
    to: otp.email,
    subject: "otp for expence tracker",
    text: `${otp.otp}`,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      // flasg message
      res.redirect("/users/forgate-password");
    } else {
      // verify otp
      res.redirect("/users/verify-otp");
    }
  });
});

// verify otp
router.get("/verify-otp", (req, res, next) => {
  res.render("otp");
});

// collecting otp data
router.post("/verify-otp", async (req, res, next) => {
  // console.log(req.body, "verify-otp");
  let otp = await Otp.findOne({ otp: req.body.otp });
  if (otp) {
    let currentTime = new Date().getTime();
    let difference = otp.extime - currentTime;
    if (difference > 0) {
      let user = await User.findOne({ email: otp.email });
      user.password = req.body.password;
      await user.save();
      if (user) {
        res.redirect("/users/sign-in");
      } else {
        res.redirect("/users/forgate-password");
      }
    } else {
      // flash message
      res.redirect("/users/forgate-password");
    }
  }
});

// logout
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  return res.redirect("/");
});
module.exports = router;
