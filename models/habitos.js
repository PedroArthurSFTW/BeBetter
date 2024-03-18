const Sequelize = require("sequelize")
const database = require("../db")
const Usuario = require("./usuario")

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
  dia_semana: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  descricao_habito: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  fk_id_usuario: {
    // Definindo explicitamente o nome da chave estrangeira
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "Usuario",
      key: "id_usuario",
    },
  },
})

/*Habitos.belongsTo(Usuario, {
  constraint: true,
  foreignKey: "fk_id_usuario",
})*/
module.exports = Habitos
