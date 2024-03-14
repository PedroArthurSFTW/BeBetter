const Sequelize = require("sequelize")
const database = require("../db")

const Metas = database.define("metas", {
  id_metas: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome_meta: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descrica_meta: {
    type: Sequelize.STRING,
    allowNull: true,
  },
})
module.exports = Metas
