const authorizeRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.body.role; // Assumes the role is sent in the request body

        if (!roles.includes(userRole)) {
            return res.status(403).json({ error: 'Forbidden: Access is denied' });
        }

        next();
    };
};

module.exports = authorizeRole;