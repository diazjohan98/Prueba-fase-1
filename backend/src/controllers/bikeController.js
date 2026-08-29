const { Bike, Client } = require("../models");

exports.createBike = async (req, res, next) => {
  try {
    const { placa, brand, model, cylinder, clientId } = req.body;

    if (!placa || !brand || !model || !clientId) {
      return res
        .status(400)
        .json({ error: "Placa, marca, modelo y clientId son obligatorios." });
    }

    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ error: "El cliente asignado no existe." });
    }

    const bike = await Bike.create({
      placa: placa.toUpperCase(),
      brand,
      model,
      cylinder,
      clientId,
    });

    return res.status(201).json(bike);
  } catch (error) {
    next(error);
  }
};

exports.getBikes = async (req, res, next) => {
  try {
    const { plate } = req.query;
    let whereClause = {};

    if (plate) {
      whereClause.placa = plate.toUpperCase();
    }

    const bikes = await Bike.findAll({
      where: whereClause,
      include: [{ model: Client, as: "client" }],
    });

    return res.json(bikes);
  } catch (error) {
    next(error);
  }
};

exports.getBikeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bike = await Bike.findByPk(id, {
      include: [{ model: Client, as: "client" }],
    });

    if (!bike) {
      return res.status(404).json({ error: "Moto no encontrada." });
    }

    return res.json(bike);
  } catch (error) {
    next(error);
  }
};
