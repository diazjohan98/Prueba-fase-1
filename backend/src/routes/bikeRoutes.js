const express = require("express");
const router = express.Router();
const bikeController = require("../controllers/bikeController");

router.post("/", bikeController.createBike);
router.get("/", bikeController.getBikes);
router.get("/:id", bikeController.getBikeById);

module.exports = router;
