const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación requerido',
      data: null,
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no válido',
        data: null,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
      data: null,
    });
  }
};

exports.authorizeRoles = (...roles) => (req, res, next) => {
  const userRole = req.user?.role?.name;

  if (!userRole || !roles.includes(userRole)) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para acceder a este recurso',
      data: null,
    });
  }

  next();
};
