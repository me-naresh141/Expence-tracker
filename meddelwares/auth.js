let User = require("../models/user");
module.exports = {
  isUserloged: (req, res, next) => {
    if (
      (req.session.passport && req.session.passport.user) ||
      req.session.userId
    ) {
      next();
    } else {
      res.redirect("/users/sign-in");
    }
  },

  userInfo: (req, res, next) => {
    // console.log(req.session, userId);
    // var userId = req.session && req.session.userId;
    // var userId = req.session.userId || req.session.passport.user;
    var userId =
      (req.session.passport && req.session.passport.user) || req.session.userId;
    // console.log("userid",userId);
    if (userId) {
      User.findById(userId, (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
        return next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      return next();
    }
  },
};
