import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)(async () => {
  const database = require("./db")
  const Usuario = require("./models/usuario")
  const Habitos = require("./models/habitos")
  const Tarefas = require("./models/tarefas")
  const Metas = require("./models/metas")
  await database.sync({ force: true })
})
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
