const Sequelize = require('sequelize');

//banco de dados
const sequelise = new Sequelize('teste', 'root', '12345', {
  host: "localhost",
  dialect: 'mysql'
})

module.exports = {
  Sequelize: Sequelize,
  sequelise: sequelise
}


