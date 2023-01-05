var passport = require("passport");
let User = require("../models/user");
var GitHubStrategy = require("passport-github").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;

// github Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      let email = profile._json.email;
      let github_profile_Data = {
        name: profile.displayName,
        email: profile._json.email,
        profilelink: profile._json.avatar_url,
        provider: [profile.provider],
      };
      console.log(github_profile_Data);
      User.findOne({ email }, (err, user) => {
        if (!user) {
          User.create(github_profile_Data, (err, user) => {
            if (err) return cb(err);
            return cb(null, user);
          });
        } else {
          user.provider.push(profile.provider);
          User.findOneAndUpdate(
            { email: profile._json.email },
            github_profile_Data,
            (err, user) => {
              return cb(null, user);
            }
          );
        }
      });
    }
  )
);

// google startgy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      let email = profile._json.email;
      let google_profile_Data = {
        name: profile._json.name,
        email: profile._json.email,
        profilelink: profile._json.picture,
        provider: [profile.provider],
      };
      // console.log(google_profile_Data);
      User.findOne({ email }, (err, user) => {
        if (!user) {
          User.create(user, (err, user) => {
            if (err) return next(err);
            return cb(null, user);
          });
        } else {
          user.provider.push(profile.provider);
          User.findOneAndUpdate(
            { email: profile._json.email },
            google_profile_Data,
            (err, user) => {
              cb(null, user);
            }
          );
        }
      });
    }
  )
);
//
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    return cb(err, user);
  });
});
