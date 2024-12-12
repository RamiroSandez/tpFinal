const admin = require("firebase-admin");

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // Esto usará las credenciales predeterminadas de Firebase
});

// Middleware para verificar el token de Firebase
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Suponiendo que el token se pase como Bearer token
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    // Verificar el token con Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Guardamos el usuario autenticado en la solicitud
    next(); // Continuamos con el siguiente middleware o la ruta
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
};

// Exportamos el middleware
module.exports = verifyToken;
