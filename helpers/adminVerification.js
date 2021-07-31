module.exports = {
  adminVerif: function (req, res, next) {
    console.log("Autenticação: " + req.isAuthenticated())
    console.log("User: " + req.user)
    next()
  }
}

/*if (req.isAuthenticated() && req.user.admin == 0) { // req.user é a variável global
      return next();
    }
    req.flash('erro_msg', 'Você precisa está logado')
    res.redirect("/")*/