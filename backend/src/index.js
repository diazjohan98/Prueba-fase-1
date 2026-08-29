const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
require("/models");

const clientRoutes = require("/routes/clientRoutes");
const bikeRoutes = require("/routes/bikeRoutes");
const workOrderRoutes = require("/routes/workOrderRoutes");
const errorRoutes = require("/routes/errorRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/clients", clientRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/work-orders", workOrderRoutes);

// Middleware
app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a MySQL establecida con éxito.");

    // sync({ alter: true }) crea o actualiza las tablas según los modelos en desarrollo
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
