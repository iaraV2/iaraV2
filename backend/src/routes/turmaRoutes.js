import express from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import {roleMiddleware} from '../middlewares/roleMiddleware.js';


import {
     criarTurmaController, editarTurmaController,
    listarTurmasProfessorController, deletarTurmaController,
    entrarNaTurmaController, listarTurmasAlunoController,
    atualizarProgressoController, liberarAlunoController,
    listarAlunosController, removerAlunoController,
    adicionarConteudoController, listarConteudosController,
    editarConteudoController, deletarConteudoController,
} from '../controllers/turmaController.js';

const router = express.Router();

 
// ─── Rotas do Professor ───────────────────────────────────────────────────────
// Criar e gerenciar turmas
router.post(   '/', authMiddleware, roleMiddleware('professor'), criarTurmaController);
router.put(    '/:turmaId', authMiddleware, roleMiddleware('professor'), editarTurmaController);
router.get(    '/minhas', authMiddleware, roleMiddleware('professor'), listarTurmasProfessorController);
router.delete( '/:turmaId', authMiddleware, roleMiddleware('professor'), deletarTurmaController);
 
// Gerenciar alunos da turma
router.get(    '/:turmaId/alunos', authMiddleware, roleMiddleware('professor'), listarAlunosController);
router.delete( '/:turmaId/alunos/:alunoId', authMiddleware, roleMiddleware('professor'), removerAlunoController);
router.patch(  '/:turmaId/alunos/:alunoId/liberar', authMiddleware, roleMiddleware('professor'), liberarAlunoController);
 
// Gerenciar conteúdos
router.post(   '/:turmaId/conteudos', authMiddleware, roleMiddleware('professor'), adicionarConteudoController);
router.put(    '/:turmaId/conteudos/:conteudoId', authMiddleware, roleMiddleware('professor'), editarConteudoController);
router.delete( '/:turmaId/conteudos/:conteudoId', authMiddleware, roleMiddleware('professor'), deletarConteudoController);
 
// ─── Rotas do Aluno ───────────────────────────────────────────────────────────
// Entrar em uma turma pelo código
router.post(  '/entrar', authMiddleware, roleMiddleware('aluno'), entrarNaTurmaController);
 
// Ver as turmas em que está matriculado
router.get(   '/minhas-turmas', authMiddleware, roleMiddleware('aluno'), listarTurmasAlunoController);
 
// Atualizar o próprio progresso numa turma
router.patch( '/:turmaId/progresso', authMiddleware, roleMiddleware('aluno'), atualizarProgressoController);
 
// ─── Rota compartilhada (aluno e professor) ───────────────────────────────────
// Ver conteúdos de uma turma — o service valida o acesso internamente
router.get(   '/:turmaId/conteudos', authMiddleware, listarConteudosController);    
 
export default router;
 