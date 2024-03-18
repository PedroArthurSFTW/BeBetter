const express = require("express")
const rotas = express.Router()
const bcrypt = require("bcrypt")
const Usuario = require("./models/usuario")
const habitos = require("./models/habitos")
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

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

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "senha",
    },
    async function (email, senha, done) {
      try {
        const usuarioEncontrado = await Usuario.findOne({ where: { email } })
        if (!usuarioEncontrado) {
          return done(null, false, { message: "Usuário não encontrado" })
        }
        const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha)
        if (!senhaValida) {
          return done(null, false, { message: "Senha incorreta" })
        }
        return done(null, usuarioEncontrado)
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.serializeUser(function (usuario, done) {
  done(null, usuario.id_usuario)
})

passport.deserializeUser(async function (id, done) {
  try {
    const usuario = await Usuario.findByPk(id)
    done(null, usuario)
  } catch (err) {
    done(err)
  }
})

Usuario.beforeCreate(async (usuario) => {
  const senhaCripto = await bcrypt.hash(usuario.senha, 10)
  usuario.senha = senhaCripto
})

rotas.post("/registrousuario", async (req, res) => {
  const novoUsuario = req.body
  await Usuario.create(novoUsuario)
  res.render("index")
})

rotas.get("/logar", (req, res) => {
  res.render("index")
})

rotas.post(
  "/logado",
  passport.authenticate("local", {
    successRedirect: "/log",
    failureRedirect: "/logar",
  })
)

rotas.get("/log", autenticacaoUsuario, (req, res) => {
  res.render("menu")
})

rotas.get("/registro_habito", autenticacaoUsuario, (req, res) => {
  res.render("criar_habitos")
})

function autenticacaoUsuario(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/logar")
}

rotas.get("/criar_habitos", autenticacaoUsuario, (req, res) => {
  res.render("criar_habitos")
})

rotas.post("/registrarhabitos", autenticacaoUsuario, async (req, res) => {
  const novoHabitos = req.body
  try {
    novoHabitos.fk_id_usuario = req.user.id_usuario
    console.log(req.user.id_usuario)
    console.log(novoHabitos)
    await habitos.create(novoHabitos)
    res.redirect("/log")
  } catch (error) {
    console.error(error)
    res.status(500).send("Erro ao registrar hábitos")
  }
})

rotas.get("/registrartarefa", autenticacaoUsuario, (req, res) => {
  res.render("criar_tarefas")
})

rotas.post("/registrartarefa", autenticacaoUsuario, async (req, res) => {
  const novoHabitos = req.body
  try {
    novoHabitos.fk_id_usuario = req.user.id_usuario
    console.log(req.user.id_usuario)
    console.log(novoHabitos)
    await habitos.create(novoHabitos)
    res.redirect("/log")
  } catch (error) {
    console.error(error)
    res.status(500).send("Erro ao registrar hábitos")
  }
})

module.exports = rotas
