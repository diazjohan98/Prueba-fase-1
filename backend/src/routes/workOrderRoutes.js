const express = require("express");
const router = express.Router();
const workOrderController = require("../controllers/workOrderController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorize");

router.use(verifyToken);

router.post("/", workOrderController.createWorkOrder);
router.get("/", workOrderController.getWorkOrders);
router.get("/:id", workOrderController.getWorkOrderById);
router.patch("/:id/status", workOrderController.updateStatus);
router.get("/:id/history", workOrderController.getOrderHistory);

router.post("/:id/items", workOrderController.addItem);
router.delete(
  "/items/:itemId",
  authorizeRoles("ADMIN"),
  workOrderController.deleteItem,
);

module.exports = router;
