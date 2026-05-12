import { alunoTemTurmaAtiva } from '../services/turmaService.js';
 
export const turmaMiddleware = async (req, res, next) => {
    const role = req.userRole;
 
    // Professores e admins não precisam de turma para acessar o chat
    if (role === 'professor' || role === 'admin') return next();
 
    try {
        const temTurma = await alunoTemTurmaAtiva(req.userId);
 
        if (!temTurma) {
            return res.status(403).json({
                message: 'Acesso bloqueado: você precisa entrar em uma turma antes de usar o chat e a sala de aula.',
                codigo:  'SEM_TURMA',
            });
        }
 
        next();
    } catch (error) {
        console.error('[turmaMiddleware] Erro ao verificar turma:', error);
        res.status(500).json({ message: 'Erro interno ao verificar acesso à turma.' });
    }
};
 