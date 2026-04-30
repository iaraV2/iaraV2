

import express from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; //? novo

const app = express()

//? Restringe o CORS para aceitar apenas o frontend — troque pela URL de produção quando deployar
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}))

app.use(express.json())

app.use("/iara",       usuarioRoutes) //? rotas públicas de usuário (cadastro, login, recuperação)
app.use("/iara/chat",  chatRoutes)    //? rotas do chatbot (privadas)
app.use("/iara/admin", adminRoutes)   //? rotas do painel admin/professor (privadas + role)

export default app