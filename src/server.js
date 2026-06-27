require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
require('./models');
const seedDatabase = require('./config/seed');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida');

    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados');

    await seedDatabase();
    console.log('Datos iniciales verificados');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
