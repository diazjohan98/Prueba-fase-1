import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StatusBadge } from "../components/StatusBadge";
import {
  getWorkOrderById,
  updateOrderStatus,
  addOrderItem,
  deleteOrderItem,
} from "../services/workshopService";

export const WorkOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");

  const [itemForm, setItemForm] = useState({
    type: "MANO_OBRA",
    description: "",
    count: 1,
    unitValue: 0,
  });

  const fetchOrderDetail = async () => {
    try {
      const data = await getWorkOrderById(id);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.error || "Error al cargar el detalle.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setStatusError("");
    try {
      await updateOrderStatus(id, newStatus);
      fetchOrderDetail();
    } catch (err) {
      setStatusError(
        err.response?.data?.error || "No se pudo cambiar el estado.",
      );
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await addOrderItem(id, itemForm);
      setItemForm({
        type: "MANO_OBRA",
        description: "",
        count: 1,
        unitValue: 0,
      });
      fetchOrderDetail();
    } catch (err) {
      alert(err.response?.data?.error || "Error al agregar ítem.");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este ítem?")) return;
    try {
      await deleteOrderItem(itemId);
      fetchOrderDetail();
    } catch (err) {
      alert("Error al eliminar el ítem.");
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Cargando detalle...</p>;
  if (error) return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <Link to="/">← Volver al listado</Link>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <h2>Orden de Trabajo #{order.id}</h2>
        <StatusBadge status={order.status} />
      </div>

      {statusError && (
        <p style={{ color: "red", background: "#fee2e2", padding: "10px" }}>
          {statusError}
        </p>
      )}

      <div
        style={{
          background: "#f8fafc",
          padding: "1rem",
          borderRadius: "8px",
          margin: "1rem 0",
        }}
      >
        <strong>Cambiar Estado: </strong>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          {[
            "RECIBIDA",
            "DIAGNOSTICO",
            "EN_PROCESO",
            "LISTA",
            "ENTREGADA",
            "CANCELADA",
          ].map((st) => (
            <button
              key={st}
              disabled={
                order.status === st ||
                order.status === "CANCELADA" ||
                order.status === "ENTREGADA"
              }
              onClick={() => handleStatusChange(st)}
              style={{ padding: "6px 12px", cursor: "pointer" }}
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
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <h4>Datos del Cliente</h4>
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
            background: "#fff",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <h4>Datos de la Moto</h4>
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

      <h3>Ítems de Servicio / Repuestos</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "1.5rem",
        }}
      >
        <thead>
          <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Tipo</th>
            <th style={{ padding: "8px" }}>Descripción</th>
            <th style={{ padding: "8px" }}>Cantidad</th>
            <th style={{ padding: "8px" }}>Valor Unitario</th>
            <th style={{ padding: "8px" }}>Subtotal</th>
            <th style={{ padding: "8px" }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "8px" }}>{item.type}</td>
              <td style={{ padding: "8px" }}>{item.description}</td>
              <td style={{ padding: "8px" }}>{item.count}</td>
              <td style={{ padding: "8px" }}>
                ${Number(item.unitValue).toLocaleString()}
              </td>
              <td style={{ padding: "8px" }}>
                ${(item.count * item.unitValue).toLocaleString()}
              </td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  style={{
                    color: "red",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ textAlign: "right", color: "#16a34a" }}>
        Total: ${Number(order.total).toLocaleString()}
      </h2>

      {/* Agregar Ítem */}
      <form
        onSubmit={handleAddItem}
        style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px" }}
      >
        <h4>Agregar Ítem a la Orden</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
            gap: "0.5rem",
          }}
        >
          <select
            value={itemForm.type}
            onChange={(e) => setItemForm({ ...itemForm, type: e.target.value })}
          >
            <option value="MANO_OBRA">MANO_OBRA</option>
            <option value="REPUESTO">REPUESTO</option>
          </select>
          <input
            type="text"
            placeholder="Descripción"
            value={itemForm.description}
            onChange={(e) =>
              setItemForm({ ...itemForm, description: e.target.value })
            }
            required
          />
          <input
            type="number"
            min="1"
            placeholder="Cantidad"
            value={itemForm.count}
            onChange={(e) =>
              setItemForm({ ...itemForm, count: e.target.value })
            }
            required
          />
          <input
            type="number"
            min="0"
            placeholder="Valor Unitario"
            value={itemForm.unitValue}
            onChange={(e) =>
              setItemForm({ ...itemForm, unitValue: e.target.value })
            }
            required
          />
          <button
            type="submit"
            style={{
              background: "#16a34a",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Agregar
          </button>
        </div>
      </form>
    </div>
  );
};
