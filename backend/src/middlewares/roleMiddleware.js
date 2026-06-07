

export const roleMiddleware = (rolesPermitidas) => {
    return (req, res, next) => {
        const roleDoUsuario = req.userRole;

        if (!roleDoUsuario) {
            return res.status(403).json({ message: 'Acesso negado: role não identificada.' });
        }

        // Admin tem acesso universal — não precisa estar listado explicitamente
        if (roleDoUsuario === 'admin') return next();

        if (!rolesPermitidas.includes(roleDoUsuario)) {
            return res.status(403).json({
                message: `Acesso negado: esta ação exige uma das seguintes permissões: ${rolesPermitidas.join(', ')}.`,
            });
        }

        next();
    };
};