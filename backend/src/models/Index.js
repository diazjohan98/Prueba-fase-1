const Client = require("./Client");
const Bike = require("./Bike");
const { WorkOrder, WORK_ORDER_STATUSES } = require("./WorkOrder");
const OrderItem = require("./OrderItem");
const { User, USER_ROLES } = require("./User");
const WorkOrderStatusHistory = require("./WorkOrderStatusHistory");

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

WorkOrder.hasMany(WorkOrderStatusHistory, {
  foreignKey: "work_order_id",
  as: "history",
});
WorkOrderStatusHistory.belongsTo(WorkOrder, {
  foreignKey: "work_order_id",
  as: "workOrder",
});

User.hasMany(WorkOrderStatusHistory, {
  foreignKey: "changed_by_user_id",
  as: "statusChanges",
});
WorkOrderStatusHistory.belongsTo(User, {
  foreignKey: "changed_by_user_id",
  as: "user",
});

module.exports = {
  Client,
  Bike,
  WorkOrder,
  OrderItem,
  User,
  WorkOrderStatusHistory,
  WORK_ORDER_STATUSES,
  USER_ROLES,
};
