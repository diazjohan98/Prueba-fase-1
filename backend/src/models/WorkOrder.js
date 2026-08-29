const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WORK_ORDER_STATUSES = [
  "RECIBIDA",
  "DIAGNOSTICO",
  "EN_PROCESO",
  "LISTA",
  "ENTREGADA",
  "CANCELADA",
];

const workOrder = sequelize.define(
  "WorkOrder",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    motoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "bikes",
        key: "id",
      },
    },
    entryDate: {
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM(...WORK_ORDER_STATUSES),
      defaultValue: "RECIBIDA",
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
  },
  {
    tableName: "work_orders",
    timestamps: true,
  },
);

module.exports = { WorkOrder, WORK_ORDER_STATUSES };
