(async () => {
  const db = require('./db')

  const User = db.sequelise.define('user', {
    admin: {
      type: db.Sequelize.STRING,
      defaultValue: 0,
    },
    nome: {
      type: db.Sequelize.STRING
    },
    email: {
      type: db.Sequelize.STRING
    },
    senha: {
      type: db.Sequelize.STRING
    },
    cpf: {
      type: db.Sequelize.STRING
    },
    pais: {
      type: db.Sequelize.STRING
    },
    estado: {
      type: db.Sequelize.STRING
    },
    municipio: {
      type: db.Sequelize.STRING
    },
    rua: {
      type: db.Sequelize.STRING
    },
    numero: {
      type: db.Sequelize.STRING
    },
    complemento: {
      type: db.Sequelize.STRING
    }
  });
  //User.sync({ force: true });
  module.exports = User

})();
