import React from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";

class AbmProductos extends React.Component {
  state = {
    data: [],
    proveedores: [], // Lista de proveedores
    form: {
      id: "",
      nombre: "",
      nombreComercial: "",
      unidadMedida: "", // Valor inicial vacío
      precioCompra: "",
      precioVenta: "",
      proveedor: "",
      foto: "",
    },
    modalInsertar: false,
    modalEditar: false,
  };

  componentDidMount() {
    this.obtenerProductos();
    this.obtenerProveedores(); // Cargar los proveedores
  }

  obtenerProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/productos");
      this.setState({ data: response.data });
    } catch (error) {
      console.error("Error al obtener los productos", error);
    }
  };

  obtenerProveedores = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/proveedores");
      this.setState({ proveedores: response.data });
    } catch (error) {
      console.error("Error al obtener los proveedores", error);
    }
  };

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  mostrarModalInsertar = () => {
    this.setState({ modalInsertar: true });
  };

  ocultarModalInsertar = () => {
    this.setState({ modalInsertar: false });
  };

  mostrarModalEditar = (producto) => {
    this.setState({ modalEditar: true, form: producto });
  };

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  };

  guardarProducto = async () => {
    try {
      const nuevoProducto = { ...this.state.form };
      const response = await axios.post(
        "http://localhost:3000/api/productos",
        nuevoProducto
      );
      this.setState({
        data: [...this.state.data, response.data],
        form: {
          id: "",
          nombre: "",
          nombreComercial: "",
          unidadMedida: "",
          precioCompra: "",
          precioVenta: "",
          proveedor: "",
          foto: "",
        },
        modalInsertar: false,
      });
    } catch (error) {
      console.error("Error al guardar el producto", error);
    }
  };

  editarProducto = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/productos/${this.state.form.id}`,
        this.state.form
      );
      const updatedProductos = this.state.data.map((producto) =>
        producto.id === this.state.form.id ? this.state.form : producto
      );
      this.setState({ data: updatedProductos, modalEditar: false });
    } catch (error) {
      console.error("Error al editar el producto", error);
    }
  };

  eliminarProducto = async (producto) => {
    const opcion = window.confirm(
      "¿Estás seguro de eliminar el producto " + producto.id + "?"
    );
    if (opcion) {
      try {
        await axios.delete(
          `http://localhost:3000/api/productos/${producto.id}`
        );
        const lista = this.state.data.filter((p) => p.id !== producto.id);
        this.setState({ data: lista });
      } catch (error) {
        console.error("Error al eliminar el producto", error);
      }
    }
  };

  render() {
    return (
      <Container>
        <Button color="success" onClick={this.mostrarModalInsertar}>
          Guardar Nuevo Producto
        </Button>

        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Nombre Comercial</th>
              <th>Unidad de Medida</th>
              <th>Precio Compra</th>
              <th>Precio Venta</th>
              <th>Proveedor</th>
              <th>Foto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((producto) => {
              const proveedor = this.state.proveedores.find(
                (prov) =>
                  prov.id ===
                  (typeof producto.proveedor === "object"
                    ? producto.proveedor.id
                    : Number(producto.proveedor))
              );

              // Mapeo de la unidad de medida a su nombre completo
              let unidadMedida = "";
              switch (producto.unidadMedida) {
                case "kg":
                  unidadMedida = "Kilogramos";
                  break;
                case "g":
                  unidadMedida = "Gramos";
                  break;
                case "l":
                  unidadMedida = "Litros";
                  break;
                case "ml":
                  unidadMedida = "Mililitros";
                  break;
                case "unidad":
                  unidadMedida = "Unidad";
                  break;
                default:
                  unidadMedida = "No especificada";
              }

              return (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.nombreComercial}</td>
                  <td>{unidadMedida}</td>{" "}
                  {/* Aquí mostrarás el nombre completo */}
                  <td>${producto.precioCompra}</td>
                  <td>${producto.precioVenta}</td>
                  <td>{proveedor ? proveedor.nombre : "No asignado"}</td>
                  <td>
                    <img
                      src={producto.foto}
                      alt="Vista previa"
                      style={{ width: "100px", height: "auto" }}
                    />
                  </td>
                  <td>
                    <Button
                      color="info"
                      onClick={() => this.mostrarModalEditar(producto)}
                    >
                      Editar
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => this.eliminarProducto(producto)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <h3>Ingresar Nuevo Producto</h3>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Nombre</label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Nombre Comercial</label>
              <input
                className="form-control"
                name="nombreComercial"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Unidad de Medida</label>
              <select
                className="form-control"
                name="unidadMedida"
                onChange={this.handleChange}
                value={this.state.form.unidadMedida}
              >
                <option value="">Seleccione una unidad</option>
                <option value="kg">Kilogramos</option>
                <option value="g">Gramos</option>
                <option value="l">Litros</option>
                <option value="ml">Mililitros</option>
                <option value="unidad">Unidad</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Precio Compra</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  className="form-control"
                  name="precioCompra"
                  type="number"
                  onChange={this.handleChange}
                />
              </div>
            </FormGroup>
            <FormGroup>
              <label>Precio Venta</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  className="form-control"
                  name="precioVenta"
                  type="number"
                  onChange={this.handleChange}
                />
              </div>
            </FormGroup>
            <FormGroup>
              <label>Proveedor</label>
              <select
                className="form-control"
                name="proveedor"
                onChange={this.handleChange}
              >
                <option value="">Seleccionar Proveedor</option>
                {this.state.proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
            </FormGroup>
            <FormGroup>
              <label>Foto</label>
              <input
                className="form-control"
                name="foto"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="info" onClick={this.guardarProducto}>
              Guardar Producto
            </Button>
            <Button color="danger" onClick={this.ocultarModalInsertar}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader>
            <h3>Editar Producto</h3>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Nombre</label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.nombre}
              />
            </FormGroup>
            <FormGroup>
              <label>Nombre Comercial</label>
              <input
                className="form-control"
                name="nombreComercial"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.nombreComercial}
              />
            </FormGroup>
            <FormGroup>
              <label>Unidad de Medida</label>
              <select
                className="form-control"
                name="unidadMedida"
                onChange={this.handleChange}
                value={this.state.form.unidadMedida}
              >
                <option value="">Seleccione una unidad</option>
                <option value="kg">Kilogramos</option>
                <option value="g">Gramos</option>
                <option value="l">Litros</option>
                <option value="ml">Mililitros</option>
                <option value="unidad">Unidad</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Precio Compra</label>
              <input
                className="form-control"
                name="precioCompra"
                type="number"
                onChange={this.handleChange}
                value={this.state.form.precioCompra}
              />
            </FormGroup>
            <FormGroup>
              <label>Precio Venta</label>
              <input
                className="form-control"
                name="precioVenta"
                type="number"
                onChange={this.handleChange}
                value={this.state.form.precioVenta}
              />
            </FormGroup>
            <FormGroup>
              <label>Proveedor</label>
              <select
                className="form-control"
                name="proveedor"
                onChange={this.handleChange}
                value={this.state.form.proveedor}
              >
                <option value="">Seleccionar Proveedor</option>
                {this.state.proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
            </FormGroup>
            <FormGroup>
              <label>Foto</label>
              <input
                className="form-control"
                name="foto"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.foto}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="info" onClick={this.editarProducto}>
              Editar Producto
            </Button>
            <Button color="danger" onClick={this.ocultarModalEditar}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default AbmProductos;
