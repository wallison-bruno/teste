function emailVerif(email) {
  (async () => {
    await User.findOne({
      attributes: ['email'],
      where: {
        email: email,
      }
    }).then(function (user) {
      if (user) {
        return true;
      } else {
        return false;
      }
    }).catch()
  })();
}
module.exports = emailVerif
