import { useState } from "react";
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
          "No se encontró ninguna moto con esa placa. Puedes registrarla abajo.",
        );
        setShowFastRegister(true);
      }
    } catch (err) {
      setError("Error al consultar la placa.");
    } finally {
      setLoading(false);
    }
  };

  const handleFastRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newBikeWithClient = await registerClientAndBike({
        clientData,
        bikeData,
        placa: plateSearch,
      });

      setSelectedBike(newBikeWithClient);
      setShowFastRegister(false);
      setMessage("¡Cliente y Moto registrados con éxito!");
    } catch (err) {
      setError(err.response?.data?.error || "Error en el registro rápido.");
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
      setError(err.response?.data?.error || "Error al crear la orden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Crear Nueva Orden de Trabajo</h1>

      {error && (
        <p
          style={{
            color: "red",
            background: "#fee2e2",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          {error}
        </p>
      )}
      {message && (
        <p
          style={{
            color: "green",
            background: "#dcfce7",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          {message}
        </p>
      )}

      <div
        style={{
          background: "#f8fafc",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "1.5rem",
        }}
      >
        <h3>1. Buscar Moto por Placa</h3>
        <form
          onSubmit={handleSearchBike}
          style={{ display: "flex", gap: "1rem" }}
        >
          <input
            type="text"
            placeholder="Ingrese Placa (ej: ABC123)"
            value={plateSearch}
            onChange={(e) => setPlateSearch(e.target.value)}
            style={{ padding: "8px", flex: 1 }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "8px 16px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {loading ? "Buscando..." : "Buscar Placa"}
          </button>
        </form>
      </div>

      {showFastRegister && (
        <form
          onSubmit={handleFastRegister}
          style={{
            background: "#fff3cd",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
          }}
        >
          <h3>Registro Rápido de Cliente y Moto</h3>
          <p>
            Placa a registrar: <strong>{plateSearch.toUpperCase()}</strong>
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <input
              type="text"
              placeholder="Nombre completo del cliente"
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
              placeholder="Correo electrónico (opcional)"
              value={clientData.email}
              onChange={(e) =>
                setClientData({ ...clientData, email: e.target.value })
              }
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
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
              placeholder="Cilindraje (opcional)"
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
              padding: "8px 16px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {loading ? "Guardando..." : "Guardar Moto y Cliente"}
          </button>
        </form>
      )}

      {selectedBike && (
        <form
          onSubmit={handleCreateOrder}
          style={{
            background: "#f0fdf4",
            padding: "1.5rem",
            borderRadius: "8px",
          }}
        >
          <h3>2. Confirmación de Moto y Falla</h3>
          <p>
            <strong>Placa:</strong> {selectedBike.placa} - {selectedBike.brand}{" "}
            {selectedBike.model}
          </p>
          <p>
            <strong>Cliente:</strong> {selectedBike.client?.name} (
            {selectedBike.client?.phone})
          </p>

          <div style={{ marginTop: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Descripción del Problema / Falla:
            </label>
            <textarea
              rows="4"
              value={faultDescription}
              onChange={(e) => setFaultDescription(e.target.value)}
              placeholder="Ej: La moto se apaga al acelerar y requiere cambio de aceite..."
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "1rem",
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "Creando Orden..." : "Generar Orden de Trabajo"}
          </button>
        </form>
      )}
    </div>
  );
};
