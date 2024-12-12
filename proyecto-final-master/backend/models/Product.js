const connection = require("../dBconnection");
const { DataTypes } = require("sequelize");

const Product = connection.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombreComercial: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unidadMedida: {
    type: DataTypes.STRING,
  },
  precioCompra: {
    type: DataTypes.INTEGER,
  },
  precioVenta: {
    type: DataTypes.INTEGER,
  },
  proveedor: {
    type: DataTypes.STRING,
  },
  fotoURL: {
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

Product.sync({ alter: true })
  .then(() => {
    console.log("Tabla de Productos actualizada exitosamente");
  })
  .catch((error) => {
    console.error("Error al actualizar la tabla de Productos:", error);
  });

module.exports = Product;
