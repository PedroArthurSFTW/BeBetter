const Sequelize = require("sequelize")
const database = require(".")
const Usuario = require("./usuario")

const Tarefas = database.define("tarefas", {
  id_tarefa: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome_tarefa: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descricao_tarefa: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  concluida: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  importancia: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})

Habitos.belongsTo(Usuario, {
  constraint: true,
  foreignKey: "fk_id_usuario",
})
module.exports = Tarefas