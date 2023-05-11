import express from "express"
import router from "./Routes/index.routes.js"

const app = express()

app.use(express.json())
app.use(router)

app.listen(5000, () => console.log("Servidor Rodando na porta 5000"))