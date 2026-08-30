export const Navbar = () => {
  return (
    <nav style={{ background: "#1e293b", padding: "1rem 2rem", color: "#fff" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>🛠️ Taller de Motos</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            to="/"
            style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}
          >
            Órdenes
          </Link>
          <Link
            to="/nueva-orden"
            style={{
              color: "#38bdf8",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            + Nueva Orden
          </Link>
        </div>
      </div>
    </nav>
  );
};
