const {
  WorkOrder,
  OrderItem,
  Bike,
  Client,
  WorkOrderStatusHistory,
  User,
} = require("../models");
const sequelize = require("../config/database");
const { validateStatusTransition } = require("../utils/statusValidator");

const recalculateOrderTotal = async (workOrderId, transaction = null) => {
  const items = await OrderItem.findAll({
    where: { work_order_id: workOrderId },
    transaction,
  });

  const total = items.reduce((sum, item) => {
    return sum + Number(item.count) * Number(item.unitValue);
  }, 0);

  await WorkOrder.update(
    { total },
    { where: { id: workOrderId }, transaction },
  );

  return total;
};

exports.createWorkOrder = async (req, res, next) => {
  try {
    const { motoId, faultDescription } = req.body;

    if (!motoId || !faultDescription) {
      return res
        .status(400)
        .json({ error: "motoId y faultDescription son obligatorios." });
    }

    const bike = await Bike.findByPk(motoId);
    if (!bike) {
      return res.status(404).json({ error: "La moto especificada no existe." });
    }

    const order = await WorkOrder.create({
      motoId,
      faultDescription,
      status: "RECIBIDA",
      total: 0,
    });

    return res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getWorkOrders = async (req, res, next) => {
  try {
    const { status, plate, page = 1, pageSize = 10 } = req.query;

    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    let bikeWhere = {};
    if (plate) {
      bikeWhere.placa = plate.toUpperCase();
    }

    let orderWhere = {};
    if (status) {
      orderWhere.status = status;
    }

    const { count, rows } = await WorkOrder.findAndCountAll({
      where: orderWhere,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Bike,
          as: "bike",
          where: Object.keys(bikeWhere).length > 0 ? bikeWhere : undefined,
          include: [{ model: Client, as: "client" }],
        },
        {
          model: OrderItem,
          as: "items",
        },
      ],
    });

    return res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      orders: rows,
    });
  } catch (error) {
    next(error);
  }
};

exports.getWorkOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await WorkOrder.findByPk(id, {
      include: [
        {
          model: Bike,
          as: "bike",
          include: [{ model: Client, as: "client" }],
        },
        {
          model: OrderItem,
          as: "items",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Orden de trabajo no encontrada." });
    }

    return res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { toStatus, note } = req.body;

    if (!toStatus) {
      await t.rollback();
      return res.status(400).json({ error: "El campo toStatus es requerido." });
    }

    const order = await WorkOrder.findByPk(id, { transaction: t });
    if (!order) {
      await t.rollback();
      return res.status(404).json({ error: "Orden de trabajo no encontrada." });
    }

    validateStatusTransition(order.status, toStatus, req.user.role);

    const fromStatus = order.status;
    order.status = toStatus;
    await order.save({ transaction: t });

    await WorkOrderStatusHistory.create(
      {
        work_order_id: id,
        from_status: fromStatus,
        to_status: toStatus,
        note: note || `Transición a ${toStatus}`,
      },
      { transaction: t },
    );

    await t.commit();
    res.json(order);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

exports.getOrderHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const history = await WorkOrderStatusHistory.findAll({
      where: { work_order_id: id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });
    res.json(history);
  } catch (error) {
    next(error);
  }
};

exports.addItem = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { type, description, count, unitValue } = req.body;

    if (
      !type ||
      !description ||
      count === undefined ||
      unitValue === undefined
    ) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: "Todos los campos del ítem son obligatorios." });
    }

    if (count <= 0) {
      await transaction.rollback();
      return res.status(400).json({ error: "La cantidad debe ser mayor a 0." });
    }

    if (unitValue < 0) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: "El valor unitario debe ser mayor o igual a 0." });
    }

    const order = await WorkOrder.findByPk(id, { transaction });
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ error: "Orden de trabajo no encontrada." });
    }

    const item = await OrderItem.create(
      {
        work_order_id: id,
        type,
        description,
        count,
        unitValue,
      },
      { transaction },
    );

    await recalculateOrderTotal(id, transaction);
    await transaction.commit();

    return res.status(201).json(item);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { itemId } = req.params;

    const item = await OrderItem.findByPk(itemId, { transaction });
    if (!item) {
      await transaction.rollback();
      return res.status(404).json({ error: "Ítem no encontrado." });
    }

    const workOrderId = item.work_order_id;
    await item.destroy({ transaction });

    await recalculateOrderTotal(workOrderId, transaction);
    await transaction.commit();

    return res.json({
      message: "Ítem eliminado y total actualizado con éxito.",
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
