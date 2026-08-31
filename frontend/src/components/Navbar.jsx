import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <header
      style={{ backgroundColor: "#0f172a", borderBottom: "1px solid #1e293b" }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0.875rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 700,
            fontSize: "1.125rem",
          }}
        >
          <span>
            MotoFix{" "}
            <span
              style={{
                color: "#94a3b8",
                fontWeight: 400,
                fontSize: "0.875rem",
              }}
            >
              | Manager
            </span>
          </span>
        </Link>
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Órdenes
          </Link>
          <Link
            to="/nueva-orden"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
            }}
          >
            + Nueva Orden
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginLeft: "1rem",
              borderLeft: "1px solid #334155",
              paddingLeft: "1rem",
            }}
          >
            <div style={{ color: "#ffffff", fontSize: "0.85rem" }}>
              <div style={{ fontWeight: 600 }}>{user.name}</div>
              <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                {user.role}
              </div>
            </div>
            <button
              onClick={logout}
              style={{
                backgroundColor: "#dc2626",
                color: "#ffffff",
                padding: "0.4rem 0.75rem",
                fontSize: "0.8rem",
              }}
            >
              Salir
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
