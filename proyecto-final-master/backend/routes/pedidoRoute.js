const express = require("express");
const router = express.Router();
const pedidoController = require("../controller/pedidoControllers");

router.get("/", pedidoController.getAllPedidos);
router.post("/", pedidoController.createPedido);
router.get("/:id", pedidoController.getPedidoById);
router.put("/:id", pedidoController.updatePedidoById);
router.delete("/:id", pedidoController.deletePedido);

module.exports = router;
