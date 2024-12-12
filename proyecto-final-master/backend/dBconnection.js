require("dotenv").config({ path: "../.env" });
const { Sequelize } = require("sequelize");

const connection = new Sequelize(process.env.MYSQL_URL, {
  dialect: process.env.DB_DIALECT || "mysql",
});

connection
  .authenticate()
  .then(() => {
    console.log("Conexión a la base de datos establecida con éxito.");
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos:", error);
  });

module.exports = connection;
