const connection = require("../dBconnection");
const { DataTypes } = require("sequelize");

const Provider = connection.define("Provider", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cuit: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Provider.sync({ alter: true })
  .then(() => {
    console.log("Tabla de Provedores actualizada exitosamente");
  })
  .catch((error) => {
    console.error("Error al actualizar la tabla de Provedores:", error);
  });

module.exports = Provider;
