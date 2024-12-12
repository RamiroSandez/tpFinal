const express = require("express");

const productController = require("../controller/productControllers");

const router = express.Router();

router.get("/", productController.getAllProduct);
router.post("/", productController.createProduct);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProductById);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
