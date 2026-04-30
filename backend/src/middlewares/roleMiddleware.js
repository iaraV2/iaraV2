// backend/src/middlewares/roleMiddleware.js

/**
 * Middleware de autorização por roles.
 * SEMPRE usado DEPOIS do authMiddleware, que já validou o JWT
 * e colocou { userId, userRole } em req.
 *
 * Uso nas rotas:
 *   router.post('/rota', authMiddleware, roleMiddleware(['admin']), controller)
 *   router.get('/rota',  authMiddleware, roleMiddleware(['admin', 'professor']), controller)
 */
export const roleMiddleware = (rolesPermitidas) => {
    return (req, res, next) => {

        //? authMiddleware já garantiu que req.userRole existe.
        //? Se por algum motivo não existir, bloqueamos.
        if (!req.userRole) {
            return res.status(403).json({
                message: 'Acesso negado: permissão insuficiente.'
            })
        }

        //? Verifica se a role do usuário logado está na lista de roles permitidas
        const temPermissao = rolesPermitidas.includes(req.userRole)

        if (!temPermissao) {
            return res.status(403).json({
                message: `Acesso negado: esta ação exige uma das seguintes permissões: ${rolesPermitidas.join(', ')}.`
            })
        }

        next() //? role autorizada — prossegue para o controller
    }
}