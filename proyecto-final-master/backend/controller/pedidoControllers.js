const Pedido = require("../models/Pedido");

async function getAllPedidos(req, res) {
  try {
    const pedidos = await Pedido.findAll();
    res.send(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al obtener los pedidos");
  }
}

async function createPedido(req, res) {
  const { listaProductos, cliente, fechaCarga, fechaEntrega, saldoTotal } =
    req.body;

  try {
    const pedido = await Pedido.create({
      listaProductos,
      cliente,
      fechaCarga,
      fechaEntrega,
      saldoTotal,
    });
    res.status(201).send(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al crear el pedido");
  }
}

async function getPedidoById(req, res) {
  const { id } = req.params;

  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(204).send("El pedido no existe");
    }
    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al obtener el pedido");
  }
}

async function updatePedidoById(req, res) {
  const { id } = req.params;
  const { listaProductos, cliente, fechaCarga, fechaEntrega, saldoTotal } =
    req.body;

  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).send("El pedido no existe");
    }

    await pedido.update({
      listaProductos,
      cliente,
      fechaCarga,
      fechaEntrega,
      saldoTotal,
    });
    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al actualizar el pedido");
  }
}

async function deletePedido(req, res) {
  const pedidoId = req.params.id;

  try {
    const pedido = await Pedido.findByPk(pedidoId);
    if (!pedido) {
      return res.status(204).send("El pedido no existe");
    } else {
      await pedido.destroy();
      res.json(pedido);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al eliminar el pedido");
  }
}

module.exports = {
  getAllPedidos,
  createPedido,
  getPedidoById,
  updatePedidoById,
  deletePedido,
};
