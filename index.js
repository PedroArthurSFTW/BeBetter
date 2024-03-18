const express = require("express")
const { Op } = require("sequelize")
const Usuario = require("./models/usuario")
var bodyParser = require("body-parser")
const app = express()
const path = require("path")
const rotas = require("./rotas")
const sequelize = require("./db")

sequelize.sync().then(() => {
  console.log("Banco conectado")
})

app.use(bodyParser.json())
app.use(rotas)
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.engine("html", require("ejs").renderFile)
app.set("view engine", "html")
app.use("/public", express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, "views"))

app.listen(3000, () => {
  console.log("O servidor esta funcionando na porta 3000")
})

app.get("/", (req, res) => {
  res.render("registro_usuario")
})

async function excluirAtividadesAnteriores() {
  try {
    const dataAtual = new Date() // Obtém a data e hora atual
    dataAtual.setHours(0, 0, 0, 0) // Define a hora como meia-noite

    // Exclui todas as tarefas anteriores à data atual
    await Tarefas.destroy({ where: { dia_tarefa: { [Op.lt]: dataAtual } } })

    // Exclui todos os hábitos anteriores à data atual
    await Habitos.destroy({ where: { dia_semana: { [Op.lt]: dataAtual } } })

    console.log("Tarefas e hábitos anteriores foram excluídos com sucesso.")
  } catch (error) {
    console.error("Erro ao excluir tarefas e hábitos anteriores:", error)
  }
}

// Chama a função para excluir as atividades anteriores uma vez quando o servidor iniciar
excluirAtividadesAnteriores()

// Agende a execução da função para excluir as atividades anteriores diariamente à meia-noite
setInterval(excluirAtividadesAnteriores, 24 * 60 * 60 * 1000) // Executa a cada 24 horas
