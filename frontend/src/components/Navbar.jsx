import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        backgroundColor: "#0f172a",
        borderBottom: "1px solid #1e293b",
        sticky: "top",
      }}
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
              color: isActive("/") ? "#ffffff" : "#94a3b8",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "0.9rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              backgroundColor: isActive("/") ? "#1e293b" : "transparent",
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
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
            }}
          >
            + Nueva Orden
          </Link>
        </nav>
      </div>
    </header>
  );
};
