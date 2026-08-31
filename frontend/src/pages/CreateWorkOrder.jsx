import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBikeByPlate,
  registerClientAndBike,
  createWorkOrderService,
} from "../services/workshopService";

export const CreateWorkOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [plateSearch, setPlateSearch] = useState("");
  const [selectedBike, setSelectedBike] = useState(null);
  const [faultDescription, setFaultDescription] = useState("");

  const [showFastRegister, setShowFastRegister] = useState(false);
  const [clientData, setClientData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [bikeData, setBikeData] = useState({
    brand: "",
    model: "",
    cylinder: "",
  });

  const handleSearchBike = async (e) => {
    e.preventDefault();
    if (!plateSearch.trim()) return;
    setLoading(true);
    setError("");
    setSelectedBike(null);
    setShowFastRegister(false);

    try {
      const bikes = await getBikeByPlate(plateSearch);
      if (bikes.length > 0) {
        setSelectedBike(bikes[0]);
      } else {
        setError(
          "No se encontró ninguna moto registrada con esa placa. Puedes registrarla a continuación.",
        );
        setShowFastRegister(true);
      }
    } catch (err) {
      setError("Error al consultar la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleFastRegister = async (e) => {
    e.preventDefault();

    const phoneDigitsOnly = clientData.phone.trim();
    if (!/^\d{10}$/.test(phoneDigitsOnly)) {
      setError(
        "El número de teléfono debe contener exactamente 10 dígitos numéricos.",
      );
      return;
    }

    if (
      clientData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email.trim())
    ) {
      setError(
        "Por favor, ingrese un correo electrónico válido (ejemplo@dominio.com).",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newBikeWithClient = await registerClientAndBike({
        clientData: {
          ...clientData,
          phone: phoneDigitsOnly,
          email: clientData.email ? clientData.email.trim() : null,
        },
        bikeData,
        placa: plateSearch,
      });

      setSelectedBike(newBikeWithClient);
      setShowFastRegister(false);
      setMessage("¡Cliente y motocicleta vinculados exitosamente!");
    } catch (err) {
      setError(err.response?.data?.error || "Error en el registro de datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!selectedBike) return;
    setLoading(true);
    setError("");

    try {
      const newOrder = await createWorkOrderService({
        motoId: selectedBike.id,
        faultDescription,
      });
      navigate(`/orden/${newOrder.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Error al generar la orden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ maxWidth: "800px", margin: "2.5rem auto", padding: "0 1.5rem" }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>
          Crear Orden de Trabajo
        </h1>
        <p
          style={{
            color: "#64748b",
            fontSize: "0.95rem",
            marginTop: "0.25rem",
          }}
        >
          Busca el vehículo o regístralo para iniciar el flujo de mantenimiento.
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            padding: "0.875rem 1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            padding: "0.875rem 1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "1.75rem",
          borderRadius: "12px",
          boxShadow: "var(--shadow-md)",
          border: "1px solid var(--border-color)",
          marginBottom: "1.5rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: 600,
            marginBottom: "1rem",
            color: "#1e293b",
          }}
        >
          1. Consultar Placa del Vehículo
        </h3>
        <form
          onSubmit={handleSearchBike}
          style={{ display: "flex", gap: "0.75rem" }}
        >
          <input
            type="text"
            placeholder="Ingrese Placa (ej: ABC123)"
            value={plateSearch}
            onChange={(e) => setPlateSearch(e.target.value.toUpperCase())}
            style={{
              flex: 1,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "0.625rem 1.25rem",
              width: "auto",
            }}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>
      </div>

      {showFastRegister && (
        <form
          onSubmit={handleFastRegister}
          style={{
            backgroundColor: "#ffffff",
            padding: "1.75rem",
            borderRadius: "12px",
            boxShadow: "var(--shadow-md)",
            border: "1px solid #fde68a",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid #fef3c7",
              paddingBottom: "0.75rem",
              marginBottom: "1.25rem",
            }}
          >
            <h3
              style={{ fontSize: "1.05rem", fontWeight: 600, color: "#92400e" }}
            >
              2. Registro Rápido
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#b45309" }}>
              Placa a registrar: <strong>{plateSearch.toUpperCase()}</strong>
            </p>
          </div>

          <h4
            style={{
              fontSize: "0.9rem",
              color: "#475569",
              marginBottom: "0.5rem",
            }}
          >
            Información del Cliente
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              marginBottom: "1.25rem",
            }}
          >
            <input
              type="text"
              placeholder="Nombre Completo"
              value={clientData.name}
              onChange={(e) =>
                setClientData({ ...clientData, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={clientData.phone}
              onChange={(e) =>
                setClientData({ ...clientData, phone: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Correo Electrónico (opcional)"
              value={clientData.email}
              onChange={(e) =>
                setClientData({ ...clientData, email: e.target.value })
              }
              style={{ gridColumn: "span 2" }}
            />
          </div>

          <h4
            style={{
              fontSize: "0.9rem",
              color: "#475569",
              marginBottom: "0.5rem",
            }}
          >
            Información de la Moto
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <input
              type="text"
              placeholder="Marca (ej: Yamaha)"
              value={bikeData.brand}
              onChange={(e) =>
                setBikeData({ ...bikeData, brand: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Modelo (ej: FZ25)"
              value={bikeData.model}
              onChange={(e) =>
                setBikeData({ ...bikeData, model: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Cilindraje"
              value={bikeData.cylinder}
              onChange={(e) =>
                setBikeData({ ...bikeData, cylinder: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#16a34a",
              color: "#ffffff",
              padding: "0.75rem 1.5rem",
              width: "100%",
            }}
          >
            {loading ? "Guardando..." : "Guardar y Seleccionar"}
          </button>
        </form>
      )}

      {selectedBike && (
        <form
          onSubmit={handleCreateOrder}
          style={{
            backgroundColor: "#ffffff",
            padding: "1.75rem",
            borderRadius: "12px",
            boxShadow: "var(--shadow-md)",
            border: "1px solid #bbf7d0",
          }}
        >
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              marginBottom: "1rem",
              color: "#166534",
            }}
          >
            2. Detalle del Mantenimiento
          </h3>

          <div
            style={{
              backgroundColor: "#f0fdf4",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1.25rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontSize: "0.85rem", color: "#15803d" }}>Vehículo:</p>
              <p style={{ fontWeight: 700, color: "#166534" }}>
                {selectedBike.placa} ({selectedBike.brand} {selectedBike.model})
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.85rem", color: "#15803d" }}>
                Propietario:
              </p>
              <p style={{ fontWeight: 600, color: "#166534" }}>
                {selectedBike.client?.name}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "#334155",
              }}
            >
              Descripción del problema / Diagnóstico preliminar:
            </label>
            <textarea
              rows="4"
              value={faultDescription}
              onChange={(e) => setFaultDescription(e.target.value)}
              placeholder="Escriba aquí los detalles reportados por el cliente o las fallas detectadas..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "0.75rem 1.5rem",
              width: "100%",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            {loading ? "Generando..." : "Generar Orden de Trabajo"}
          </button>
        </form>
      )}
    </div>
  );
};
