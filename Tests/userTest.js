const User = require('../models/User')

User.findOrCreate({
  where: { id: 63119956 },
  defaults: {
    nome: 'qual quer nome'
  }
}).then((user) => {
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + user)

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



