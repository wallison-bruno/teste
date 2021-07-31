const localStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcryptjs')

require('../models/User')

module.exports = (passport) => {

  passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'senha'
  }, (email, senha, done) => {
    (async () => {
      await User.findOne({
        where: {
          email: email,
        }
      }).then(function (user) {
        if (!user) {
          return done(null, false, { message: "Esta conta não existe!" });
        }
        bcrypt.compare(senha, user.senha, (erro, batem) => {
          if (batem) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Senha incorrreta!"
            });
          }
        });
      }).catch();
    })();
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    (async () => {
      const user = await User.findByPk(id)
      done(null, user);
    })();
  });
}
