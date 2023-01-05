var express = require("express");
var router = express.Router();
let Income = require("../models/income");
let Expence = require("../models/expence");
let passport = require("passport");

/* GET home page. */
// router.get("/", function (req, res, next) {
//   let userId =
//     (req.session.passport && req.session.passport.user) || req.session.userId;
//   if (userId) {
//     Income.find({ userId }, (err, incomeAmmount) => {
//       // console.log(incomeAmmount);
//       if (err) return next(err);
//       Expence.find({ userId }, (err, expenceAmmount) => {
//         if (err) return next(err);
//         res.render("index", { incomeAmmount, expenceAmmount });
//       });
//     });
//   } else {
//     Income.find({ userId }, (err, incomeAmmount) => {
//       if (err) return next(err);
//       Expence.find({ userId }, (err, expenceAmmount) => {
//         if (err) return next(err);
//         return res.render("index", { incomeAmmount, expenceAmmount });
//       });
//     });
//   }
// });

// router.get("/", function (req, res, next) {
//   let userId =
//     (req.session.passport && req.session.passport.user) || req.session.userId;
//   if (userId) {
//     Income.find({ userId }, (err, incomeAmmount) => {
//       // console.log(incomeAmmount);
//       if (err) return next(err);
//       Expence.find({ userId }, (err, expenceAmmount) => {
//         if (err) return next(err);
//         Income.find({ userId }).distinct("source", (err, allIncomeSource) => {
//           if (err) return next(err);
//           // console.log(allIncomeSource);
//           Expence.find({ userId }).distinct(
//             "source",
//             (err, allExpenceSource) => {
//               if (err) return next(err);
//               // console.log(allExpenceSource)
//               res.render("index", {
//                 incomeAmmount,
//                 expenceAmmount,
//                 allIncomeSource,
//                 allExpenceSource,
//               });
//             }
//           );
//         });
//       });
//     });
//   } else {
//     Income.find({ userId }, (err, incomeAmmount) => {
//       if (err) return next(err);
//       Expence.find({ userId }, (err, expenceAmmount) => {
//         Income.find({ userId }).distinct("source", (err, allIncomeSource) => {
//           if (err) return next(err);
//           Expence.find({ userId }).distinct(
//             "source",
//             (err, allExpenceSource) => {
//               if (err) return next(err);
//               return res.render("index", {
//                 incomeAmmount,
//                 expenceAmmount,
//                 allIncomeSource,
//                 allExpenceSource,
//               });
//             }
//           );
//         });
//       });
//     });
//   }
// });

// router.get("/", function (req, res, next) {
//   let userId =
//     (req.session.passport && req.session.passport.user) || req.session.userId;
//   let obj = {};
//   let { source } = req.query;
//   if (source) {
//     obj.userId = userId;
//     obj.source = source;
//   } else {
//     obj.userId = userId;
//   }
//   //
//   if (userId) {
//     Income.find(obj, (err, incomeAmmount) => {
//       console.log(incomeAmmount);
//       if (err) return next(err);
//       Expence.find(obj, (err, expenceAmmount) => {
//         if (err) return next(err);
//         Income.find({ userId }).distinct("source", (err, allIncomeSource) => {
//           if (err) return next(err);
//           Expence.find({ userId }).distinct(
//             "source",
//             (err, allExpenceSource) => {
//               if (err) return next(err);
//               // console.log(allExpenceSource)
//               res.render("index", {
//                 incomeAmmount,
//                 expenceAmmount,
//                 allIncomeSource,
//                 allExpenceSource,
//               });
//             }
//           );
//         });
//       });
//     });
//   } else {
//     Income.find({ userId }, (err, incomeAmmount) => {
//       if (err) return next(err);
//       Expence.find({ userId }, (err, expenceAmmount) => {
//         Income.find({ userId }).distinct("source", (err, allIncomeSource) => {
//           if (err) return next(err);
//           Expence.find({ userId }).distinct(
//             "source",
//             (err, allExpenceSource) => {
//               if (err) return next(err);
//               return res.render("index", {
//                 incomeAmmount,
//                 expenceAmmount,
//                 allIncomeSource,
//                 allExpenceSource,
//               });
//             }
//           );
//         });
//       });
//     });
//   }
// });

router.get("/", function (req, res, next) {
  let userId =
    (req.session.passport && req.session.passport.user) || req.session.userId;
  let obj = {};
  let { source } = req.query;
  if (source) {
    obj.userId = userId;
    obj.source = source;
  } else {
    obj.userId = userId;
  }
  //
  if (userId) {
    Income.find({ userId }, (err, allincomeAmmount) => {
      Expence.find({ userId }, (err, allExpenceAmmount) => {
        Income.find(obj, (err, incomeAmmount) => {
          console.log(incomeAmmount);
          if (err) return next(err);
          Expence.find(obj, (err, expenceAmmount) => {
            if (err) return next(err);
            Income.find({ userId }).distinct(
              "source",
              (err, allIncomeSource) => {
                if (err) return next(err);
                Expence.find({ userId }).distinct(
                  "source",
                  (err, allExpenceSource) => {
                    if (err) return next(err);
                    // console.log(allExpenceSource)
                    res.render("index", {
                      allincomeAmmount,
                      allExpenceAmmount,
                      incomeAmmount,
                      expenceAmmount,
                      allIncomeSource,
                      allExpenceSource,
                    });
                  }
                );
              }
            );
          });
        });
      });
    });
  } else {
    Income.find({ userId }, (err, allincomeAmmount) => {
      Expence.find({ userId }, (err, allExpenceAmmount) => {
        Income.find(obj, (err, incomeAmmount) => {
          console.log(incomeAmmount);
          if (err) return next(err);
          Expence.find(obj, (err, expenceAmmount) => {
            if (err) return next(err);
            Income.find({ userId }).distinct(
              "source",
              (err, allIncomeSource) => {
                if (err) return next(err);
                Expence.find({ userId }).distinct(
                  "source",
                  (err, allExpenceSource) => {
                    if (err) return next(err);
                    res.render("index", {
                      allincomeAmmount,
                      allExpenceAmmount,
                      incomeAmmount,
                      expenceAmmount,
                      allIncomeSource,
                      allExpenceSource,
                    });
                  }
                );
              }
            );
          });
        });
      });
    });
  }
});

// github route
router.get("/auth/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "sign-in" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

// google route

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "sign-in" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
module.exports = router;
