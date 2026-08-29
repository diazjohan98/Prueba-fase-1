const { Client } = require("../models");
const { Op } = require("sequelize");

exports.createClient = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !phone) {
      return res
        .status(400)
        .json({ error: "El nombre y el teléfono son requeridos." });
    }

    const client = await Client.create({ name, email, phone });
    return res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

exports.getClients = async (req, res, next) => {
  try {
    const { search } = req.query;
    let whereClause = {};

    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const clients = await Client.findAll({ where: whereClause });
    return res.json(clients);
  } catch (error) {
    next(error);
  }
};

exports.getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }

    return res.json(client);
  } catch (error) {
    next(error);
  }
};
