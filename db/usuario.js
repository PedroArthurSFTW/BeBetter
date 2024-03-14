const Sequelize = require("sequelize")
const database = require("../db")

const Usuario = database.define("usuario", {
  id_usuario: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  nome_usuario: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  idade: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  data_de_nascimento: {
    type: Sequelize.DATE,
    allowNull: false,
  },
})

module.exports = Usuario
