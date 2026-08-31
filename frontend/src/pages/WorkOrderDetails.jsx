import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getWorkOrderById,
  updateWorkOrderStatus,
  addOrderItem,
  deleteOrderItem,
} from "../services/workshopService";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export const WorkOrderDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("detalles");

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [statusError, setStatusError] = useState("");

  const [itemData, setItemData] = useState({
    type: "MANO_OBRA",
    description: "",
    count: 1,
    unitValue: 0,
  });

  const fetchOrderData = async () => {
    try {
      const data = await getWorkOrderById(id);
      setOrder(data);

      const historyRes = await api.get(`/work-orders/${id}/history`);
      setHistory(historyRes.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error al cargar la orden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [id]);

  const openStatusModal = (newStatus) => {
    setTargetStatus(newStatus);
    setStatusNote("");
    setStatusError("");
    setShowStatusModal(true);
  };

  const handleConfirmStatusChange = async (e) => {
    e.preventDefault();
    setStatusError("");

    try {
      await updateWorkOrderStatus(id, targetStatus, statusNote);
      setShowStatusModal(false);
      fetchOrderData();
    } catch (err) {
      setStatusError(
        err.response?.data?.error || "Transición de estado no permitida.",
      );
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await addOrderItem(id, itemData);
      setItemData({
        type: "MANO_OBRA",
        description: "",
        count: 1,
        unitValue: 0,
      });
      fetchOrderData();
    } catch (err) {
      alert(err.response?.data?.error || "Error al agregar ítem.");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este ítem?")) return;
    try {
      await deleteOrderItem(itemId);
      fetchOrderData();
    } catch (err) {
      alert(err.response?.data?.error || "Error al eliminar ítem.");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        Cargando detalles de la orden...
      </div>
    );
  if (error && !order)
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#dc2626" }}>
        {error}
      </div>
    );

  const STATUSES = [
    "RECIBIDA",
    "DIAGNOSTICO",
    "EN_PROCESO",
    "LISTA",
    "ENTREGADA",
    "CANCELADA",
  ];

  return (
    <div
      style={{ maxWidth: "1000px", margin: "2rem auto", padding: "0 1.5rem" }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "#2563eb",
          fontWeight: 500,
          fontSize: "0.9rem",
        }}
      >
        ← Volver al listado
      </Link>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "1rem 0 1.5rem 0",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>
          Orden de Trabajo #{order.id}
        </h1>
        <span
          style={{
            backgroundColor: "#e0f2fe",
            color: "#0369a1",
            padding: "0.35rem 0.85rem",
            borderRadius: "20px",
            fontWeight: 700,
            fontSize: "0.85rem",
          }}
        >
          {order.status}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          borderBottom: "2px solid #e2e8f0",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={() => setActiveTab("detalles")}
          style={{
            padding: "0.5rem 1rem",
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "detalles" ? "3px solid #2563eb" : "none",
            color: activeTab === "detalles" ? "#2563eb" : "#64748b",
            fontWeight: 600,
          }}
        >
          Detalles e Ítems
        </button>
        <button
          onClick={() => setActiveTab("historial")}
          style={{
            padding: "0.5rem 1rem",
            background: "none",
            border: "none",
            borderBottom:
              activeTab === "historial" ? "3px solid #2563eb" : "none",
            color: activeTab === "historial" ? "#2563eb" : "#64748b",
            fontWeight: 600,
          }}
        >
          Historial y Auditoría ({history.length})
        </button>
      </div>

      {activeTab === "detalles" && (
        <>
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "1.25rem",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              marginBottom: "1.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#475569",
                marginBottom: "0.75rem",
              }}
            >
              Cambiar Estado:
            </h3>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {STATUSES.map((st) => (
                <button
                  key={st}
                  onClick={() => openStatusModal(st)}
                  disabled={order.status === st || order.status === "ENTREGADA"}
                  style={{
                    backgroundColor:
                      order.status === st ? "#2563eb" : "#f1f5f9",
                    color: order.status === st ? "#ffffff" : "#334155",
                    padding: "0.4rem 0.85rem",
                    fontSize: "0.8rem",
                    opacity:
                      order.status === st || order.status === "ENTREGADA"
                        ? 0.6
                        : 1,
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "1.25rem",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h4
                style={{
                  fontSize: "0.9rem",
                  color: "#64748b",
                  marginBottom: "0.5rem",
                }}
              >
                Datos del Cliente
              </h4>
              <p>
                <strong>Nombre:</strong> {order.bike?.client?.name}
              </p>
              <p>
                <strong>Teléfono:</strong> {order.bike?.client?.phone}
              </p>
              <p>
                <strong>Email:</strong> {order.bike?.client?.email || "N/A"}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "1.25rem",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h4
                style={{
                  fontSize: "0.9rem",
                  color: "#64748b",
                  marginBottom: "0.5rem",
                }}
              >
                Datos de la Moto
              </h4>
              <p>
                <strong>Placa:</strong> {order.bike?.placa}
              </p>
              <p>
                <strong>Marca/Modelo:</strong> {order.bike?.brand} -{" "}
                {order.bike?.model}
              </p>
              <p>
                <strong>Cilindraje:</strong> {order.bike?.cylinder || "N/A"}
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "1.25rem",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              marginBottom: "1.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              Ítems de Servicio / Repuestos
            </h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid #e2e8f0",
                    textAlign: "left",
                    color: "#64748b",
                  }}
                >
                  <th style={{ padding: "0.5rem" }}>Tipo</th>
                  <th style={{ padding: "0.5rem" }}>Descripción</th>
                  <th style={{ padding: "0.5rem" }}>Cantidad</th>
                  <th style={{ padding: "0.5rem" }}>Valor U.</th>
                  <th style={{ padding: "0.5rem" }}>Subtotal</th>
                  {user?.role === "ADMIN" && (
                    <th style={{ padding: "0.5rem" }}>Acción</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <td style={{ padding: "0.5rem" }}>{item.type}</td>
                    <td style={{ padding: "0.5rem" }}>{item.description}</td>
                    <td style={{ padding: "0.5rem" }}>{item.count}</td>
                    <td style={{ padding: "0.5rem" }}>
                      ${Number(item.unitValue).toLocaleString()}
                    </td>
                    <td style={{ padding: "0.5rem", fontWeight: 600 }}>
                      $
                      {(
                        Number(item.count) * Number(item.unitValue)
                      ).toLocaleString()}
                    </td>
                    {user?.role === "ADMIN" && (
                      <td style={{ padding: "0.5rem" }}>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          style={{
                            backgroundColor: "#ef4444",
                            color: "#fff",
                            padding: "0.2rem 0.5rem",
                            fontSize: "0.75rem",
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                textAlign: "right",
                marginTop: "1rem",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#16a34a",
              }}
            >
              Total: ${Number(order.total).toLocaleString()}
            </div>
          </div>

          <form
            onSubmit={handleAddItem}
            style={{
              backgroundColor: "#ffffff",
              padding: "1.25rem",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
            }}
          >
            <select
              value={itemData.type}
              onChange={(e) =>
                setItemData({ ...itemData, type: e.target.value })
              }
              style={{ width: "160px" }}
            >
              <option value="MANO_OBRA">MANO OBRA</option>
              <option value="REPUESTO">REPUESTO</option>
            </select>
            <input
              type="text"
              placeholder="Descripción"
              value={itemData.description}
              onChange={(e) =>
                setItemData({ ...itemData, description: e.target.value })
              }
              required
              style={{ flex: 1 }}
            />
            <input
              type="number"
              min="1"
              placeholder="Cant"
              value={itemData.count}
              onChange={(e) =>
                setItemData({ ...itemData, count: e.target.value })
              }
              style={{ width: "80px" }}
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Valor Unitario"
              value={itemData.unitValue}
              onChange={(e) =>
                setItemData({ ...itemData, unitValue: e.target.value })
              }
              style={{ width: "130px" }}
              required
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#16a34a",
                color: "#fff",
                padding: "0.6rem 1.25rem",
              }}
            >
              + Agregar
            </button>
          </form>
        </>
      )}

      {activeTab === "historial" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              marginBottom: "1.25rem",
            }}
          >
            Línea del Tiempo de Estados
          </h3>
          {history.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              No existen registros de auditoría aún.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {history.map((h) => (
                <div
                  key={h.id}
                  style={{
                    borderLeft: "3px solid #2563eb",
                    paddingLeft: "1rem",
                    position: "relative",
                  }}
                >
                  <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {new Date(h.createdAt).toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "#0f172a",
                      margin: "0.2rem 0",
                    }}
                  >
                    {h.from_status
                      ? `${h.from_status} ➔ ${h.to_status}`
                      : `Apertura: ${h.to_status}`}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#334155" }}>
                    <strong>Usuario:</strong> {h.user?.name} ({h.user?.role})
                  </div>
                  {h.note && (
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#475569",
                        fontStyle: "italic",
                        marginTop: "0.25rem",
                      }}
                    >
                      "{h.note}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showStatusModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "1.75rem",
              borderRadius: "12px",
              width: "420px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              Cambiar Estado a: {targetStatus}
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginBottom: "1rem",
              }}
            >
              Ingresa una nota o motivo para el historial de auditoría.
            </p>

            {statusError && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  marginBottom: "1rem",
                  fontSize: "0.85rem",
                }}
              >
                {statusError}
              </div>
            )}

            <form onSubmit={handleConfirmStatusChange}>
              <textarea
                rows="3"
                placeholder="Ej: Se completó la revisión de frenos..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                style={{ width: "100%", marginBottom: "1.25rem" }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  style={{
                    backgroundColor: "#94a3b8",
                    color: "#fff",
                    padding: "0.5rem 1rem",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    padding: "0.5rem 1rem",
                  }}
                >
                  Confirmar Cambio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
