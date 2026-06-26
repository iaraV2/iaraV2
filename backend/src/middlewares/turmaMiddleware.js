export const turmaMiddleware = async (req, res, next) => {
    // Removida restrição de turma - alunos podem acessar chat sem estar matriculado
    next();
};
 