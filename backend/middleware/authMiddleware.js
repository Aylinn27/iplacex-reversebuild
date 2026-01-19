const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const tokenHeader = req.header('Authorization');
    
    if (!tokenHeader) {
        return res.status(401).json({ msg: 'No hay token, permiso denegado' });
    }

    try {
        const token = tokenHeader.replace('Bearer ', '');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;
        next(); 
    } catch (err) {
        res.status(401).json({ msg: 'Token no es válido' });
    }
};