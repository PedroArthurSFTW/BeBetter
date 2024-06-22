const express = require("express")
const Sequelize = require("sequelize")
const rotas = express.Router()
const bcrypt = require("bcrypt")
const Usuario = require("./models/usuario")
const habitos = require("./models/habitos")
const Tarefas = require("./models/tarefas")
const Metas = require("./models/metas")
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const nodemailer = require("nodemailer")
const uuid = require("uuid")
var bodyParser = require("body-parser")

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "confirmacaobebetter@gmail.com",
//     pass: "aexwjvmnbbvlhbwr",
//   },
// })

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
        // Verificar se o e-mail do usuário foi confirmado
        // if (!usuarioEncontrado.confirmed) {
        //   return done(null, false, { message: "E-mail ainda não confirmado" })
        // }
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
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 1)
  usuario.confirmationExpires = expirationDate
})

rotas.post("/registrousuario", async (req, res) => {
  const novoUsuario = req.body
  const confirmationToken = uuid.v4()
  novoUsuario.confirmationToken = confirmationToken
  await Usuario.create(novoUsuario)
  // const mailOptions = {
  //   from: "confirmacaobebetter@gmail.com",
  //   to: novoUsuario.email,
  //   subject: "Confirmação de Registro",
  //   text: `Clique neste link para confirmar seu registro: http://localhost:3000/confirm/${confirmationToken}`,
  // }
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.log(error)
  //   } else {
  //     console.log("Email enviado: " + info.response)
  //   }
  // })
  res.redirect("/logar")
})

rotas.get("/confirm/:token", async (req, res) => {
  const { token } = req.params

  try {
    const usuario = await Usuario.findOne({
      where: { confirmationToken: token },
    })

    if (!usuario || usuario.confirmationExpires < new Date()) {
      return res
        .status(400)
        .send("O token de confirmação é inválido ou expirou.")
    }

    usuario.confirmed = true
    usuario.confirmationToken = null
    usuario.confirmationExpires = null
    await usuario.save()

    return res.render("tela_confirmacao")
  } catch (error) {
    console.error(error)
    return res.status(500).send("Ocorreu um erro ao confirmar sua conta.")
  }
})

rotas.get("/logar", (req, res) => {
  res.render("login")
})

rotas.get("/registrar", (req, res) => {
  res.render("registro_usuario")
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

rotas.post("/registrarhabitos", autenticacaoUsuario, async (req, res) => {
  const novoHabitos = req.body
  try {
    novoHabitos.fk_id_usuario = req.user.id_usuario
    await habitos.create(novoHabitos)
    res.redirect("/log")
  } catch (error) {
    console.error(error)
    res.status(500).send("Erro ao registrar hábitos")
  }
})

rotas.get("/registro_tarefa", autenticacaoUsuario, (req, res) => {
  res.render("criar_tarefas")
})

rotas.post("/registrartarefa", autenticacaoUsuario, async (req, res) => {
  const novaTarefa = req.body
  try {
    novaTarefa.fk_id_usuario = req.user.id_usuario
    await Tarefas.create(novaTarefa)
    res.redirect("/log")
  } catch (error) {
    console.error(error)
    res.status(500).send("Erro ao registrar tarefas")
  }
})

rotas.get("/registro_meta", autenticacaoUsuario, async (req, res) => {
  res.render("criar_metas")
})

rotas.post("/criar_metas", autenticacaoUsuario, async (req, res) => {
  const novaMetas = req.body
  try {
    novaMetas.fk_id_usuario = req.user.id_usuario
    await Metas.create(novaMetas)
    res.redirect("/log")
  } catch (error) {
    console.error(error)
    res.status(500).send("Erro ao registrar metas")
  }
})

rotas.get("/atividades-do-dia", autenticacaoUsuario, async (req, res) => {
  try {
    const userId = req.user.id_usuario
    const dataAtual = new Date()
    const dataAtualSemHora = new Date(dataAtual.setHours(0, 0, 0, 0))

    const tarefas = await Tarefas.findAll({
      where: Sequelize.and(
        Sequelize.where(
          Sequelize.fn("DATE", Sequelize.col("dia_tarefa")),
          "=",
          Sequelize.fn("CURDATE")
        ),
        { fk_id_usuario: userId }
      ),
    })

    const habito = await habitos.findAll({
      where: { fk_id_usuario: userId },
    })

    const metasNaoConcluidas = await Metas.findAll({
      where: { fk_id_usuario: userId, concluida: null },
    })

    const metasConcluidas = await Metas.findAll({
      where: { fk_id_usuario: userId, concluida: true },
    })

    res.render("atividades-do-dia", {
      tarefas,
      habito,
      metasNaoConcluidas,
      metasConcluidas,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send("Erro ao buscar atividades do dia")
  }
})

rotas.post(
  "/marcar-tarefa-concluida/:id",
  autenticacaoUsuario,
  async (req, res) => {
    try {
      const idTarefa = req.params.id
      await Tarefas.update(
        { concluida: "Sim" },
        { where: { id_tarefa: idTarefa } }
      )
      res.redirect("/atividades-do-dia")
    } catch (error) {
      console.error(error)
      res.status(500).send("Erro ao marcar tarefa como concluída")
    }
  }
)

rotas.post("/deletar-tarefa/:id", autenticacaoUsuario, async (req, res) => {
  try {
    const idTarefa = req.params.id
    await Tarefas.destroy({ where: { id_tarefa: idTarefa } })
    res.redirect("/atividades-do-dia")
  } catch (error) {
    console.error(error)
    res.status(500).send("Erro ao deletar tarefa")
  }
})

rotas.post(
  "/marcar-meta-concluida/:id",
  autenticacaoUsuario,
  async (req, res) => {
    try {
      const idMeta = req.params.id
      await Metas.update({ concluida: "sim" }, { where: { id_metas: idMeta } })
      res.redirect("/atividades-do-dia")
    } catch (error) {
      console.error(error)
      res.status(500).send("Erro ao marcar meta como concluída")
    }
  }
)

rotas.get(
  "/mostrar-metas-concluidas",
  autenticacaoUsuario,
  async (req, res) => {
    const userId = req.user.id_usuario
    try {
      const metasConcluidas = await Metas.findAll({
        where: { fk_id_usuario: req.user.id_usuario, concluida: "sim" },
      })
      res.render("metas_concluidas", { metasConcluidas })
    } catch (error) {
      console.error(error)
      res.status(500).send("Erro ao buscar metas concluídas")
    }
  }
)

rotas.post("/deletar-habito/:id", autenticacaoUsuario, async (req, res) => {
  try {
    const idHabito = req.params.id
    await habitos.destroy({ where: { id_habitos: idHabito } })
    res.redirect("/atividades-do-dia")
  } catch (error) {
    console.error(error)
    res.status(500).send("Erro ao deletar hábito")
  }
})

module.exports = rotas
