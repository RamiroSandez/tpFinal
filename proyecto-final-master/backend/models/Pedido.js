const connection = require("../dBconnection");
const { DataTypes } = require("sequelize");

const Pedido = connection.define("Pedido", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  listaProductos: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cliente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaCarga: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fechaEntrega: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  saldoTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
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

Pedido.sync({ alter: true })
  .then(() => {
    console.log("Tabla de Pedidos actualizada exitosamente");
  })
  .catch((error) => {
    console.error("Error al actualizar la tabla de Pedidos:", error);
  });

module.exports = Pedido;
