var express = require("express");
var router = express.Router();
var Income = require("../models/income");
var Expence = require("../models/expence");

var auth = require("../meddelwares/auth");
// new transition
router.post("/new", auth.isUserloged, (req, res, next) => {
  req.body.userId =
    (req.session.passport && req.session.passport.user) || req.session.userId;
  if (req.body.work == "income") {
    Income.create(req.body, (err, newtransition) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  } else {
    Expence.create(req.body, (err, newtransition) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  }
});

// delete transition

router.get("/:id/delete", (req, res, next) => {
  let id = req.params.id;
  //
  Income.findById(id, (err, incomeObj) => {
    if (!incomeObj) {
      Expence.findByIdAndDelete(id, (err, expenceAmount) => {
        return res.redirect("/");
      });
    } else {
      Income.findByIdAndDelete(id, (err, incomeAmount) => {
        return res.redirect("/");
      });
    }
  });
});

module.exports = router;
