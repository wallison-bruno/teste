module.exports = {
  autenticado: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('erro_msg', 'Você precisa está logado para ter acesso a essa página')
    res.redirect("/")
  }
}