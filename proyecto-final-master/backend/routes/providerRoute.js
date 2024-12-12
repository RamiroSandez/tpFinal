const express = require("express");
const ProviderController = require("../controller/providerControllers");

const router = express.Router();

router.get("/", ProviderController.getAllProvider);
router.post("/", ProviderController.createProvider);
router.get("/:id", ProviderController.getProviderById);
router.put("/:id", ProviderController.updateProviderById);
router.delete("/:id", ProviderController.deleteProvider);

module.exports = router;
