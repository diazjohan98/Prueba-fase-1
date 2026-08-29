const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define(
  "OrderITem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    work_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "work_orders",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("MANO_OBRA", "REPUESTO"),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // Cantidad > 0
      },
    },
    unitValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0, // Valor unitario >= 0
      },
    },
  },
  {
    tableName: "order_items",
    timestamps: true,
  },
);

module.exports = OrderItem;
