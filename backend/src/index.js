const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
require("./models"); // Carga los modelos y sus relaciones

const clientRoutes = require("./routes/clientRoutes");
const bikeRoutes = require("./routes/bikeRoutes");
const workOrderRoutes = require("./routes/workOrderRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use("/api/clients", clientRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/work-orders", workOrderRoutes);

// Middleware centralizado de errores
app.use(errorHandler);

// Inicializar Servidor y Base de Datos
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a MySQL establecida con éxito.");

    await sequelize.sync({ alter: true });
    console.log("Tablas e índices sincronizados correctamente.");

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

startServer();
