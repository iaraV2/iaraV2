 
export const roleMiddleware = (...rolesPermitidas) => {
    return (req, res, next) => {
        const roleDoUsuario = req.userRole;
 
        if (!roleDoUsuario) {
            return res.status(403).json({ message: 'Acesso negado: role não identificada.' });
        }
 
        // Admin tem acesso a tudo
        if (roleDoUsuario === 'admin') return next();
 
        if (!rolesPermitidas.includes(roleDoUsuario)) {
            return res.status(403).json({
                message: `Acesso negado: esta ação é permitida apenas para ${rolesPermitidas.join(' ou ')}.`,
            });
        }
 
        next();
    };
};