const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role?.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const formatUser = (user) => ({
  id: user.id,
  nombre: user.nombre,
  email: user.email,
  role: user.role?.name,
});

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos',
        data: null,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres',
        data: null,
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado',
        data: null,
      });
    }

    const customerRole = await Role.findOne({ where: { name: 'CUSTOMER' } });
    if (!customerRole) {
      return res.status(500).json({
        success: false,
        message: 'Rol CUSTOMER no configurado',
        data: null,
      });
    }

    const user = await User.create({
      nombre,
      email,
      password,
      roleId: customerRole.id,
    });

    const userWithRole = await User.findByPk(user.id, {
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['password'] },
    });

    const token = generateToken(userWithRole);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: { token, user: formatUser(userWithRole) },
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      data: null,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos',
        data: null,
      });
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }],
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        data: null,
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        token,
        user: formatUser(user),
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      data: null,
    });
  }
};

exports.getProfile = async (req, res) => {
  res.json({
    success: true,
    message: 'Perfil obtenido correctamente',
    data: formatUser(req.user),
  });
};
