const Provider = require("../models/Provider");

async function getAllProvider(req, res) {
  try {
    const providers = await Provider.findAll();
    res.send(providers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al obtener los proveedores");
  }
}

async function createProvider(req, res) {
  const { cuit, nombre } = req.body;

  try {
    const provider = await Provider.create({ cuit, nombre });
    res.status(201).send(provider);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al crear el proveedor");
  }
}

function getProviderById(req, res) {
  const { id } = req.params;

  Provider.findByPk(id)
    .then((provider) => {
      if (!provider) {
        return res.status(404).send("El proveedor no existe");
      }
      res.json(provider);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Hubo un problema al obtener el proveedor");
    });
}

async function updateProviderById(req, res) {
  const { id } = req.params;
  const { cuit, nombre } = req.body;

  try {
    const provider = await Provider.findByPk(id);

    if (!provider) {
      return res.status(404).send("El proveedor no existe");
    }

    await provider.update({ cuit, nombre });

    res.json(provider);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al actualizar el proveedor");
  }
}

async function deleteProvider(req, res) {
  const providerId = req.params.id;

  try {
    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      return res.status(404).send("El proveedor no existe");
    }

    await provider.destroy();
    res.status(200).send("Proveedor eliminado correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al eliminar el proveedor");
  }
}

module.exports = {
  getAllProvider,
  createProvider,
  getProviderById,
  updateProviderById,
  deleteProvider,
};
