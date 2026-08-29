const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

router.post("/", clientController.createClient);
router.get("/", clientController.getClients);
router.get("/:id", clientController.getClientById);

module.exports = router;
