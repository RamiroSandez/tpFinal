const Product = require("../models/Product");

async function getAllProduct(req, res) {
  try {
    const products = await Product.findAll();
    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al obtener los Productos");
  }
}
async function createProduct(req, res) {
  const {
    nombreComercial,
    nombre,
    unidadMedida,
    precioCompra,
    precioVenta,
    proveedor,
    fotoURL,
  } = req.body;

  try {
    const product = await Product.create({
      nombreComercial,
      nombre,
      unidadMedida,
      precioCompra,
      precioVenta,
      proveedor,
      fotoURL,
    });
    res.status(201).send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al crear el producto");
  }
}

function getProductById(req, res) {
  const { id } = req.params;

  Product.findByPk(id)
    .then((product) => {
      if (!product) {
        return res.status(204).send("El producto no existe");
      }
      res.json(product);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Hubo un problema al obtener el producto");
    });
}

async function updateProductById(req, res) {
  const { id } = req.params;
  const {
    nombreComercial,
    nombre,
    unidadMedida,
    precioCompra,
    precioVenta,
    proveedor,
    fotoURL,
  } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).send("El producto no existe");
    }

    await product.update({
      nombreComercial,
      nombre,
      unidadMedida,
      precioCompra,
      precioVenta,
      proveedor,
      fotoURL,
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al actualizar el producto");
  }
}

async function deleteProduct(req, res) {
  const productId = req.params.id;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(204).send("El Producto no existe");
    } else {
      await product.destroy();
      res.json(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un problema al eliminar el producto");
  }
}

module.exports = {
  getAllProduct,
  createProduct,
  getProductById,
  updateProductById,
  deleteProduct,
};
