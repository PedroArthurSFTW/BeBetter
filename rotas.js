const express = require("express")
const rotas = express.Router()
const usuario = require("./models/usuario")
const habitos = require("./models/habitos")
var bodyParser = require("body-parser")

rotas.use(bodyParser.json())
rotas.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

rotas.post("/registrousuario", async (req, res) => {
  const novoUsuario = req.body
  await usuario.create(novoUsuario)
  res.render("index")
})

rotas.post("/registrarhabitos", async (req, res) => {
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
