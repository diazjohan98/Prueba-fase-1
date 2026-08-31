import api from "../api/axios";

export const registerClientAndBike = async ({
  clientData,
  bikeData,
  placa,
}) => {
  const clientRes = await api.post("/clients", clientData);
  const newClient = clientRes.data;

  const bikeRes = await api.post("/bikes", {
    placa: placa.toUpperCase(),
    ...bikeData,
    clientId: newClient.id,
  });

  return {
    ...bikeRes.data,
    client: newClient,
  };
};

export const createWorkOrderService = async ({ motoId, faultDescription }) => {
  const response = await api.post("/work-orders", {
    motoId,
    faultDescription,
  });
  return response.data;
};

export const getBikeByPlate = async (plate) => {
  const response = await api.get(`/bikes?plate=${plate.trim()}`);
  return response.data;
};

export const getWorkOrderById = async (id) => {
  const response = await api.get(`/work-orders/${id}`);
  return response.data;
};

export const updateWorkOrderStatus = async (orderId, toStatus, note = "") => {
  const response = await api.patch(`/work-orders/${orderId}/status`, {
    toStatus,
    note,
  });
  return response.data;
};
export const addOrderItem = async (id, itemData) => {
  const response = await api.post(`/work-orders/${id}/items`, itemData);
  return response.data;
};

export const deleteOrderItem = async (itemId) => {
  const response = await api.delete(`/work-orders/items/${itemId}`);
  return response.data;
};
