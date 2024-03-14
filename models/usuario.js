const Sequelize = require("sequelize")
const database = require("../db")

const Usuario = database.define("usuario", {
  id_usuario: {
    type: Sequelize.INTEGER,
    autoIncrement: false,
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
    allowNull: true,
  },
  genero: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})

module.exports = Usuario
