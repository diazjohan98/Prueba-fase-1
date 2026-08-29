const Client = require("./Client");
const Bike = require("./Bike");
const { workOrder, WORK_ORDER_STATUSES, WorkOrder } = require("./WorkOrder");
const OrderITem = require("./OrderItem");

// Client -> motos
Client.hasMany(Bike, { foreignKey: "clientId", as: "bikes" });
Bike.belongsTo(Client, { foreignKey: "clientId", as: "client" });

// moto -> ordenes
Bike.hasMany(WorkOrder, { foreignKey: "motoId", as: "workOrders" });
WorkOrder.belongsTo(Bike, { foreignKey: "motoId", as: "bike" });

//Order -> ITems
WorkOrder.hasMany(OrderITem, {
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
