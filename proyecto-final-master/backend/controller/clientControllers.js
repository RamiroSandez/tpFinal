const Client = require("../models/Client");

async function getAllClient(req, res) {
  try {
    const clients = await Client.findAll();
    res.send(clients);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al obtener los clientes");
  }
}
async function createClient(req, res) {
  const { cuit, nombre } = req.body;

  try {
    const client = await Client.create({ cuit, nombre });
    res.status(201).send(client);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al crear el cliente");
  }
}

function getClientById(req, res) {
  const { id } = req.params;

  Client.findByPk(id)
    .then((client) => {
      if (!client) {
        return res.status(204).send("El cliente no existe");
      }
      res.json(client);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Hubo un problema al obtener el cliente");
    });
}

async function updateClientById(req, res) {
  const { id } = req.params;
  const { cuit, nombre } = req.body;

  try {
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).send("El cliente no existe");
    }

    await client.update({ cuit, nombre });

    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al actualizar el cliente");
  }
}

async function deleteClient(req, res) {
  const clientId = req.params.id;

  try {
    const client = await Client.findByPk(clientId);
    if (!client) {
      res.status(204).send("El cliente no existe");
    } else {
      await client.destroy();
      res.json(client);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al eliminar el cliente");
  }
}

module.exports = {
  getAllClient,
  createClient,
  getClientById,
  updateClientById,
  deleteClient,
};
