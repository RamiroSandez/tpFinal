const express = require("express");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/rutaprotegida", verifyToken, (req, res) => {
  res.json({ message: "Acceso permitido", user: req.user });
});

module.exports = router;
