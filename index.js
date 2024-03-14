const express = require("express")
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
/*;async () => {
  const database = require("./db")
  const Usuario = require("./models/usuario")
  const Metas = require("./models/metas")
  const Tarefas = require("./models/tarefas")
  const Habitos = require("./models/habitos")
  await database.sync({ force: true })
  const novoUsuario = await Usuario.create({
    id_usuario: 1,
    nome_usuario: "Cleitom",
    idade: 22,
    email: "Xitãozinho24",
    senha: "123456",
    genero: "Helicptero",
  })
  const usuario = await Usuario.findByPk(1)
  console.log(usuario.nome_usuario)
}*/
