const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const USER_ROLES = ["ADMIN", "MECANICO"];

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM(...USER_ROLES), defaultValue: "MECANICO" },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: "users", timestamps: true },
);

module.exports = { User, USER_ROLES };
