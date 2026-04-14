//! essa pasta app.js serve para configurarmos o projeto como um todo, um esqueleto do processo um manual de regras

import express, { json } from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes.js';
import chatRoutes from "./routes/chatRoutes.js"

const app = express() //? inincializa nosso express atribuindo a variavel app

app.use(cors())
app.use(express.json()) //? para o express poder ler os json (body params)


app.use("/iara", usuarioRoutes) //? aqui eu defino como padrão o uso do endpoint "iara" antes de chamar qualquer rota de usuario
app.use("/iara/chat", chatRoutes)

export default app
