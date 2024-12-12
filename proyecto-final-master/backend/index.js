const express = require("express");
const cors = require("cors");
const verifyToken = require("./middlewares/verifyToken");
const clientRoutes = require("./routes/clientRoute");
const pedidoRoutes = require("./routes/pedidoRoute");
const productsRoutes = require("./routes/productoRoute");
const providerRoutes = require("./routes/providerRoute");
const connection = require("./dBconnection");
const rutasProtegidas = require("./routes/firebaseRoute");

const admin = require("firebase-admin");

// Verificar si Firebase ya está inicializado antes de intentar inicializarlo nuevamente
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
} else {
  admin.app(); // Si ya está inicializado, usar la instancia existente
}


app.use(
  express.static(path.join(__dirname, "../frontend/mi-primer-app/build"))
);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/mi-primer-app/build", "index.html")
  );
});

const app = express();
const port = process.env.PORT;


app.use(express.json());

// Rutas públicas (sin necesidad de autenticación)
app.use("/api/clientes", clientRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/productos", productsRoutes);
app.use("/api/proveedores", providerRoutes);

app.use("/api/rutaProtegida", rutasProtegidas);

connection
  .authenticate()
  .then(() => {
    console.log("Conexión a la base de datos exitosa");
  })
  .catch((err) => {
    console.error("No se pudo conectar a la base de datos:", err);
  });

app.get("/protected", verifyToken, (req, res) => {
  res.status(200).send("Acceso permitido");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
