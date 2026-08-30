import { useEffect, useState } from "react";
import { StatusBadge } from "../components/StatusBadge";
import { Link } from "react-router-dom";
import { api } from "../api/axios";

export const WorkOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [plate, setPlate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/work-orders`, {
        params: { status, plate, page, pageSize: 5 },
      });
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.error || "Error al cargar las órdenes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Órdenes de Trabajo</h1>

      {/* Filtros */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Buscar por placa (ej: ABC123)"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="">-- Todos los estados --</option>
          <option value="RECIBIDA">RECIBIDA</option>
          <option value="DIAGNOSTICO">DIAGNOSTICO</option>
          <option value="EN_PROCESO">EN_PROCESO</option>
          <option value="LISTA">LISTA</option>
          <option value="ENTREGADA">ENTREGADA</option>
          <option value="CANCELADA">CANCELADA</option>
        </select>
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Filtrar
        </button>
      </form>

      {/* Indicadores de UX */}
      {loading && <p>Cargando órdenes...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Tabla de Órdenes */}
      {!loading && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f8fafc",
                borderBottom: "2px solid #e2e8f0",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>Placa</th>
              <th style={{ padding: "12px" }}>Cliente</th>
              <th style={{ padding: "12px" }}>Estado</th>
              <th style={{ padding: "12px" }}>Fecha Entrada</th>
              <th style={{ padding: "12px" }}>Total</th>
              <th style={{ padding: "12px" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No se encontraron órdenes registrados.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px" }}>#{o.id}</td>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>
                    {o.bike?.placa}
                  </td>
                  <td style={{ padding: "12px" }}>{o.bike?.client?.name}</td>
                  <td style={{ padding: "12px" }}>
                    <StatusBadge status={o.status} />
                  </td>
                  <td style={{ padding: "12px" }}>
                    {new Date(o.entryDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>
                    ${Number(o.total).toLocaleString()}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Link
                      to={`/orden/${o.id}`}
                      style={{
                        color: "#2563eb",
                        textDecoration: "none",
                        fontWeight: "500",
                      }}
                    >
                      Ver detalle →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Paginación */}
      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          style={{ padding: "6px 12px" }}
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages || 1}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          style={{ padding: "6px 12px" }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
