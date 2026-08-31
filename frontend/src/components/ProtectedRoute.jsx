import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        Cargando sesión...
      </div>
    );
  }
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#dc2626" }}>
        Acceso denegado: No posees permisos para esta sección.
      </div>
    );
  }

  return children;
};
