const User = require('../models/User')



User.findByPk(50).then((user) => {
  (async () => {
    console.log(user)
  })();
});



/*User.findOne({
  attributes: ['email'],
  where: {
    email: 'wallyson-bruno@hotmail.com',
  }
}
).then(function (user) {
  if (user) {
    console.log('USUÁRIO: ' + user.email)
  } else {
    console.log('NÃO ENCONTRADO!!!')
  }
}).catch(function (erro) {
  res.send('ERROR: ' + erro)
})
*/



