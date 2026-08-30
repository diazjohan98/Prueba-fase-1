const Client = require("./Client");
const Bike = require("./Bike");
const { WorkOrder, WORK_ORDER_STATUSES } = require("./WorkOrder");
const OrderItem = require("./OrderItem");

// Cliente -> Motos
Client.hasMany(Bike, { foreignKey: "clientId", as: "bikes" });
Bike.belongsTo(Client, { foreignKey: "clientId", as: "client" });

// Moto -> Ordenes
Bike.hasMany(WorkOrder, { foreignKey: "motoId", as: "workOrders" });
WorkOrder.belongsTo(Bike, { foreignKey: "motoId", as: "bike" });

// Orden -> Items
WorkOrder.hasMany(OrderItem, {
  foreignKey: "work_order_id",
  as: "items",
  onDelete: "CASCADE",
});
OrderItem.belongsTo(WorkOrder, {
  foreignKey: "work_order_id",
  as: "workOrder",
});

module.exports = {
  Client,
  Bike,
  WorkOrder,
  OrderItem,
  WORK_ORDER_STATUSES,
};
