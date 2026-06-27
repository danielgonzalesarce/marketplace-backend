const { Role, User, Category } = require('../models');

const seedDatabase = async () => {
  const [adminRole] = await Role.findOrCreate({
    where: { name: 'ADMIN' },
    defaults: { name: 'ADMIN' },
  });

  const [customerRole] = await Role.findOrCreate({
    where: { name: 'CUSTOMER' },
    defaults: { name: 'CUSTOMER' },
  });

  const defaultCategories = [
    { nombre: 'Electrónica', descripcion: 'Dispositivos electrónicos' },
    { nombre: 'Accesorios', descripcion: 'Accesorios y periféricos' },
    { nombre: 'Computación', descripcion: 'Equipos de cómputo' },
  ];

  for (const category of defaultCategories) {
    await Category.findOrCreate({
      where: { nombre: category.nombre },
      defaults: category,
    });
  }

  const adminExists = await User.findOne({
    where: { email: 'admin@productstore.com' },
  });

  if (!adminExists) {
    await User.create({
      nombre: 'Administrador',
      email: 'admin@productstore.com',
      password: 'admin123',
      roleId: adminRole.id,
    });
    console.log('Usuario admin creado: admin@productstore.com / admin123');
  }

  const customerExists = await User.findOne({
    where: { email: 'cliente@productstore.com' },
  });

  if (!customerExists) {
    await User.create({
      nombre: 'Cliente Demo',
      email: 'cliente@productstore.com',
      password: 'cliente123',
      roleId: customerRole.id,
    });
    console.log('Usuario customer creado: cliente@productstore.com / cliente123');
  }
};

module.exports = seedDatabase;
