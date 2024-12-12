const admin = require("firebase-admin");
const path = require("path");

// Verificar si Firebase ya está inicializado antes de intentar inicializarlo nuevamente
if (!admin.apps.length) {
  // Cargar la clave privada de Firebase desde la ruta especificada en el .env
  const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);

  // Inicializar Firebase con nombre único
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  // Si ya está inicializado, usa la instancia existente
  admin.app();
}

module.exports = admin;
