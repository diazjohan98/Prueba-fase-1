const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WorkOrderStatusHistory = sequelize.define(
  "WorkOrderStatusHistory",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    work_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "work_orders", key: "id" },
    },
    from_status: { type: DataTypes.STRING, allowNull: true },
    to_status: { type: DataTypes.STRING, allowNull: false },
    note: { type: DataTypes.TEXT, allowNull: true },
    changed_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  },
  {
    tableName: "work_order_status_history",
    timestamps: true,
    updatedAt: false,
    indexes: [{ fields: ["work_order_id", "createdAt"] }],
  },
);

module.exports = WorkOrderStatusHistory;
