import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

import {
    criarTurmaController, editarTurmaController,
    listarTurmasProfessorController, deletarTurmaController,
    entrarNaTurmaController, listarTurmasAlunoController, buscarTurmaPorCodigoController,
    buscarTurmasPorTituloController, listarTodasTurmasPublicasController,
    atualizarProgressoController, liberarAlunoController,
    listarAlunosController, removerAlunoController,
    adicionarConteudoController, listarConteudosController,
    editarConteudoController, deletarConteudoController,
    uploadPdfController, listarPdfsController,
    baixarPdfController, deletarPdfController,
} from '../controllers/turmaController.js';

const MAX_PDF_BYTES = 700 * 1024;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_PDF_BYTES },
    fileFilter: (req, file, cb) => {
        const okMime = file.mimetype === 'application/pdf';
        const okExt = (file.originalname || '').toLowerCase().endsWith('.pdf');
        if (okMime && okExt) cb(null, true);
        else cb(new Error('Apenas arquivos PDF (.pdf) são permitidos.'));
    },
});

const uploadPdfMiddleware = (req, res, next) => {
    upload.single('pdf')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ erro: 'PDF muito grande. Máximo permitido: 700KB.' });
            }
            return res.status(400).json({ erro: err.message || 'Erro no upload do PDF.' });
        }
        next();
    });
};

const router = express.Router();

// ─── Rotas do Professor ───────────────────────────────────────────────────────
router.post(   '/', authMiddleware, roleMiddleware('professor'), criarTurmaController);
router.put(    '/:turmaId', authMiddleware, roleMiddleware('professor'), editarTurmaController);
router.get(    '/minhas', authMiddleware, roleMiddleware('professor'), listarTurmasProfessorController);
router.delete( '/:turmaId', authMiddleware, roleMiddleware('professor'), deletarTurmaController);

router.get(    '/:turmaId/alunos', authMiddleware, roleMiddleware('professor'), listarAlunosController);
router.delete( '/:turmaId/alunos/:alunoId', authMiddleware, roleMiddleware('professor'), removerAlunoController);
router.patch(  '/:turmaId/alunos/:alunoId/liberar', authMiddleware, roleMiddleware('professor'), liberarAlunoController);

router.post(   '/:turmaId/conteudos', authMiddleware, roleMiddleware('professor'), adicionarConteudoController);
router.put(    '/:turmaId/conteudos/:conteudoId', authMiddleware, roleMiddleware('professor'), editarConteudoController);
router.delete( '/:turmaId/conteudos/:conteudoId', authMiddleware, roleMiddleware('professor'), deletarConteudoController);

router.post(   '/:turmaId/conteudos/:conteudoId/pdfs', authMiddleware, roleMiddleware('professor'), uploadPdfMiddleware, uploadPdfController);
router.get(    '/:turmaId/conteudos/:conteudoId/pdfs', authMiddleware, listarPdfsController);
router.get(    '/:turmaId/conteudos/:conteudoId/pdfs/:pdfId/download', authMiddleware, baixarPdfController);
router.delete( '/:turmaId/conteudos/:conteudoId/pdfs/:pdfId', authMiddleware, roleMiddleware('professor'), deletarPdfController);

// ─── Rotas do Aluno ───────────────────────────────────────────────────────────
router.post(  '/entrar', authMiddleware, roleMiddleware('aluno'), entrarNaTurmaController);
router.get(   '/minhas-turmas', authMiddleware, roleMiddleware('aluno'), listarTurmasAlunoController);
router.patch( '/:turmaId/progresso', authMiddleware, roleMiddleware('aluno'), atualizarProgressoController);

// ─── Rota Pública ──────────────────────────────────────────────────────────────
router.get(   '/buscar/:codigo', buscarTurmaPorCodigoController);
router.get(   '/buscar-por-titulo/:titulo', buscarTurmasPorTituloController);
router.get(   '/todas-publicas', authMiddleware, listarTodasTurmasPublicasController);

// ─── Rota compartilhada ───────────────────────────────────────────────────────
router.get(   '/:turmaId/conteudos', authMiddleware, listarConteudosController);

export default router;
