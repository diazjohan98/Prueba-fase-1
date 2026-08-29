const express = require("express");
const router = express.Router();
const workOrderController = require("../controllers/workOrderController");

router.post("/", workOrderController.createWorkOrder);
router.get("/", workOrderController.getWorkOrders);
router.get("/:id", workOrderController.getWorkOrderById);
router.patch("/:id/status", workOrderController.updateStatus);
router.post("/:id/items", workOrderController.addItem);
router.delete("/items/:itemId", workOrderController.deleteItem);

module.exports = router;
