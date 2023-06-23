const passport = require("passport");
const { getDb } = require("../database/connection");
//import collection from database
console.log(getDb);
const User = getDb().collection("users");
//require strategy
const FacebookStrategy = require("passport-facebook");
//create a strategy
//continue with facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: "784824509685895",
      clientSecret: "621509339ae8081ea41f833e19b66459",
      callbackURL: "http://localhost:6453/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
      User.insertOne({ facebookId: profile.id })
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => cb(err, false));
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, false);
    });
});
module.exports = passport;
