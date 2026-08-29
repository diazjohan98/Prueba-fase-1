const errorHandler = (err, req, res, next) => {
  console.error("Error detectado:", err);

  //Error de validacion de Sequelize --- placa dupplicada

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      error: "Dato duplicado",
      message: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: "Error de validacion",
      message: err.errors.map((e) => e.message),
    });
  }

  // Errores de codigo
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  return res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
