const { Role, User, Category, Product } = require('../models');

const defaultProducts = [
  {
    nombre: 'Smartphone Galaxy Pro',
    precio: 1899.99,
    descripcion: 'Teléfono inteligente con pantalla AMOLED de 6.7" y cámara de 108 MP.',
    categoryName: 'Electrónica',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
  },
  {
    nombre: 'Audífonos Bluetooth Pro',
    precio: 349.99,
    descripcion: 'Audífonos inalámbricos con cancelación activa de ruido y 30 h de batería.',
    categoryName: 'Electrónica',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  },
  {
    nombre: 'Tablet Ultra 11"',
    precio: 1299.0,
    descripcion: 'Tablet ideal para productividad y entretenimiento con stylus incluido.',
    categoryName: 'Electrónica',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
  },
  {
    nombre: 'Mouse Inalámbrico Ergo',
    precio: 89.99,
    descripcion: 'Mouse ergonómico silencioso con sensor de alta precisión.',
    categoryName: 'Accesorios',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
  },
  {
    nombre: 'Teclado Mecánico RGB',
    precio: 279.99,
    descripcion: 'Teclado mecánico con switches táctiles e iluminación RGB personalizable.',
    categoryName: 'Accesorios',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
  },
  {
    nombre: 'Webcam Full HD 1080p',
    precio: 159.99,
    descripcion: 'Cámara web con micrófono integrado, ideal para videollamadas y streaming.',
    categoryName: 'Accesorios',
    imageUrl: 'https://images.unsplash.com/photo-1587826080696-40c8a059a048?w=600&q=80',
  },
  {
    nombre: 'Laptop Pro 15"',
    precio: 4599.99,
    descripcion: 'Laptop de alto rendimiento con procesador de última generación y 16 GB RAM.',
    categoryName: 'Computación',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
  },
  {
    nombre: 'Monitor 27" 4K',
    precio: 1199.99,
    descripcion: 'Monitor UHD con tecnología IPS y frecuencia de 144 Hz para gaming y diseño.',
    categoryName: 'Computación',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
  },
  {
    nombre: 'Hub USB-C 7 en 1',
    precio: 129.99,
    descripcion: 'Adaptador multipuerto con HDMI, USB 3.0 y lector de tarjetas SD.',
    categoryName: 'Accesorios',
    imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613afbf331?w=600&q=80',
  },
];

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

  for (const item of defaultProducts) {
    const category = await Category.findOne({ where: { nombre: item.categoryName } });
    const [product, created] = await Product.findOrCreate({
      where: { nombre: item.nombre },
      defaults: {
        nombre: item.nombre,
        precio: item.precio,
        descripcion: item.descripcion,
        imageUrl: item.imageUrl,
        categoryId: category?.id ?? null,
      },
    });

    if (!created && (!product.imageUrl || !product.categoryId)) {
      await product.update({
        imageUrl: product.imageUrl || item.imageUrl,
        categoryId: product.categoryId || category?.id,
        descripcion: product.descripcion || item.descripcion,
      });
    }
  }

  console.log(`${defaultProducts.length} productos de demo verificados`);

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
