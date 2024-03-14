const Sequelize = require("sequelize")
const database = require(".")
const Usuario = require("./usuario")

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

Habitos.belongsTo(Usuario, {
  constraint: true,
  foreignKey: "fk_id_usuario",
})
module.exports = Metas
