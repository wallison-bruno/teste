var GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/User')
const passport = require('passport')
require('dotenv').config

var GitHubStrategy = require('passport-github').Strategy;

function authGuithub() {
  passport.use(new GitHubStrategy({
    clientID: '9b4b1bd02e12c51f115d',
    clientSecret: "34bb80631e1997f3b2d9e75628d35b23844a5e8e",
    callbackURL: "http://localhost:8081/auth/github/callback"
  },
    function (accessToken, refreshToken, profile, cb) {
      (async () => {
        await User.findOrCreate({
          where: { id: profile.id },
          defaults: {
            nome: profile.displayName.split(' ')[0],
            email: profile.displayName.split(' ')[0] + profile.id + '@teste.com.br',
          }
        }).then((param) => {
          const [user, created] = param
          return cb(null, user);
        });
      })();
    }
  ));
}
module.exports = authGuithub