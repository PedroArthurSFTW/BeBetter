const Sequelize = require("sequelize")
const database = require("../db")

const Habitos = database.define("habitos", {
  id_habitos: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome_habito: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})
module.exports = Habitos
