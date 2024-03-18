const express = require("express")
const rotas = express.Router()
const bcrypt = require("bcrypt")
const usuario = require("./models/usuario")
const habitos = require("./models/habitos")
const session = require("express-session")
const passport = require("passport")
var bodyParser = require("body-parser")

rotas.use(bodyParser.json())
rotas.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
rotas.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
)
rotas.use(passport.initialize())
rotas.use(passport.session())

usuario.beforeCreate(async (usuario) => {
  const senhaCripto = await bcrypt.hash(usuario.senha, 10)
  usuario.senha = senhaCripto
})
rotas.post("/registrousuario", async (req, res) => {
  const novoUsuario = req.body
  await usuario.create(novoUsuario)
  res.render("index")
})
rotas.get("/logar", (req, res) => {
  res.render("index")
})

rotas.post("/logado", async (req, res) => {
  const { email, senha } = req.body
  try {
    const usuario_log = await usuario.findOne({
      where: { email },
    })
    if (!usuario_log) {
      return res.status(404).send("Usuario não encontrado")
    }
    const senhaValida = await bcrypt.compare(senha, usuario_log.senha)
    if (!senhaValida) {
      return res.status(401).send("Senha Incorreta")
    }
    res.render("criar_habitos")
  } catch (error) {
    console.error(error)
    res.status(500).send("Erro ao efetuar o Login")
  }
})

function autenticacaoUsuario(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/logar")
}

rotas.get("/logado", autenticacaoUsuario, (req, res) => {
  res.render(criar_habitos)
})

rotas.post("/registrarhabitos", autenticacaoUsuario, async (req, res) => {
  const novoHabitos = req.body
  await habitos.create(novoHabitos)
  res.render("index")
})

rotas.get("/testgetus", async (req, res) => {
  try {
    const usuarios = await usuario.findAll()
    res.status(201).json(usuarios)
  } catch (error) {
    throw error
  }
})

rotas.get("/testgethab", async (req, res) => {
  try {
    const habitos = await habitos.findAll()
    res.status(201).json(habitos)
  } catch (error) {
    throw error
  }
})

module.exports = rotas
