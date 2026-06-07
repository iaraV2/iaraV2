//! essa pasta app.js serve para configurarmos o projeto como um todo, um esqueleto do processo um manual de regras

import express, { json } from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes.js';
import chatRoutes from "./routes/chatRoutes.js";
import turmaRoutes from "./routes/turmaRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express()

app.use(cors())
app.use(express.json())

// Rotas existentes
app.use("/iara", usuarioRoutes)
app.use("/iara/chat", chatRoutes)

// Novas rotas
app.use("/iara/turmas", turmaRoutes);
app.use("/iara/admin", adminRoutes);

export default app