const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          error:
            "Acceso denegado. No posees el rol requerido para esta acción.",
        });
    }
    next();
  };
};

module.exports = authorizeRoles;
