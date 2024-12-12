const express = require("express");

const clientController = require("../controller/clientControllers");

const router = express.Router();

router.get("/", clientController.getAllClient);
router.post("/", clientController.createClient);
router.get("/:id", clientController.getClientById);
router.put("/:id", clientController.updateClientById);
router.delete("/:id", clientController.deleteClient);

module.exports = router;
