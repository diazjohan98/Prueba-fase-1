const VALID_TRANSITIONS = {
  RECIBIDA: ["DIAGNOSTICO", "CANCELADA"],
  DIAGNOSTICO: ["EN_PROCESO", "CANCELADA"],
  EN_PROCESO: ["LISTA", "CANCELADA"],
  LISTA: ["ENTREGADA", "CANCELADA"],
  ENTREGADA: [],
  CANCELADA: [],
};

const validateStatusTransition = (currentStatus, newStatus) => {
  if (currentStatus === newStatus) {
    const error = new Error(
      `Transición redundante: la orden ya está en '${currentStatus}'.`,
    );
    error.statusCode = 400;
    throw error;
  }
  if (currentStatus === "ENTREGADA") {
    const error = new Error(
      "La orden fue ENTREGADA. No se permiten cambios de estado posteriores.",
    );
    error.statusCode = 400;
    throw error;
  }

  const allowedNextStatuses = VALID_TRANSITIONS[currentStatus] || [];
  if (!allowedNextStatuses.includes(newStatus)) {
    const error = new Error(
      `Transición inválida de '${currentStatus}' a '${newStatus}'.`,
    );
    error.statusCode = 400;
    throw error;
  }

  if (userRole === "MECANICO") {
    const mecanicoAllowed = ["DIAGNOSTICO", "EN_PROCESO", "LISTA"];
    if (!mecanicoAllowed.includes(newStatus)) {
      const error = new Error(
        `El rol MECANICO no tiene permisos para pasar la orden a '${newStatus}'.`,
      );
      error.statusCode = 403;
      throw error;
    }
  }
  return true;
};

module.exports = { validateStatusTransition };
