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
    return true;
  }

  const allowedNextStatuses = VALID_TRANSITIONS[currentStatus] || [];

  if (!allowedNextStatuses.includes(newStatus)) {
    throw {
      statusCode: 400,
      message: `Transición inválida: No se puede pasar de estado ${currentStatus} a ${newStatus}.`,
    };
  }

  return true;
};

module.exports = { validateStatusTransition };
