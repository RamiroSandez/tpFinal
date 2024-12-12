import React from "react";
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
import axios from "axios";

class AbmPedidos extends React.Component {
  state = {
    data: [],
    clientes: [],
    productos: [], // Nuevo estado para productos
    form: {
      id: "",
      listaProductos: "",
      cliente: "",
      fechaCarga: "",
      fechaEntrega: "",
      saldoTotal: "",
    },
    modalInsertar: false,
    modalEditar: false,
  };

  componentDidMount() {
    this.obtenerPedidos();
    this.obtenerClientes();
    this.obtenerProductos(); // Cargar productos al iniciar el componente
  }

  obtenerClientes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/clientes");
      console.log("Clientes obtenidos:", response.data);
      this.setState({ clientes: response.data });
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  obtenerProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/productos");
      console.log("Productos obtenidos:", response.data);
      this.setState({ productos: response.data });
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  obtenerPedidos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/pedidos");
      console.log("Pedidos obtenidos:", response.data);
      this.setState({ data: response.data });
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
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

  mostrarModalEditar = (pedido) => {
    this.setState({ modalEditar: true, form: pedido });
  };

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  };

  guardarPedido = async () => {
    const nuevoPedido = { ...this.state.form };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/pedidos",
        nuevoPedido
      );

      this.setState((prevState) => ({
        data: [...prevState.data, response.data],
        form: {
          id: "",
          listaProductos: "",
          cliente: "",
          fechaCarga: "",
          fechaEntrega: "",
          saldoTotal: "",
        },
        modalInsertar: false,
      }));

      this.obtenerPedidos();
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
    }
  };

  editarPedido = async (pedido) => {
    try {
      await axios.put(`http://localhost:3000/api/pedidos/${pedido.id}`, pedido);
      this.setState((prevState) => ({
        data: prevState.data.map((p) => (p.id === pedido.id ? pedido : p)),
        modalEditar: false,
      }));
      this.obtenerPedidos();
    } catch (error) {
      console.error("Error al editar el pedido:", error);
    }
  };

  eliminar = async (pedido) => {
    const opcion = window.confirm(
      "Estás seguro de eliminar el pedido " + pedido.id + "?"
    );
    if (opcion) {
      try {
        await axios.delete(`http://localhost:3000/api/pedidos/${pedido.id}`);
        this.setState((prevState) => ({
          data: prevState.data.filter((p) => p.id !== pedido.id),
        }));
        this.obtenerPedidos();
      } catch (error) {
        console.error("Error al eliminar el pedido:", error);
      }
    }
  };

  render() {
    return (
      <Container>
        <Button color="success" onClick={this.mostrarModalInsertar}>
          Guardar Nuevo Pedido
        </Button>

        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Lista de Productos</th>
              <th>Cliente</th>
              <th>Fecha Carga</th>
              <th>Fecha Entrega</th>
              <th>Saldo Total</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {this.state.data.map((elemento) => {
              const cliente = this.state.clientes.find(
                (c) =>
                  c.id ===
                  (typeof elemento.cliente === "object"
                    ? elemento.cliente.id
                    : Number(elemento.cliente))
              );
              // Obtener los nombres de los productos correspondientes
              const productosNombres = elemento.listaProductos
                .split(",") // Si listaProductos es una lista separada por comas
                .map((idProducto) => {
                  const producto = this.state.productos.find(
                    (p) => p.id === Number(idProducto)
                  );
                  return producto ? producto.nombre : "Producto no encontrado";
                })
                .join(", ");

              return (
                <tr key={elemento.id}>
                  <td>{elemento.id}</td>
                  <td>{productosNombres}</td>
                  <td>{cliente ? cliente.nombre : "Cliente no encontrado"}</td>
                  <td>
                    {new Date(elemento.fechaCarga).toLocaleDateString("es-ES")}
                  </td>
                  <td>
                    {new Date(elemento.fechaEntrega).toLocaleDateString(
                      "es-ES"
                    )}
                  </td>
                  <td>${elemento.saldoTotal}</td>
                  <td>
                    <Button
                      color="info"
                      onClick={() => this.mostrarModalEditar(elemento)}
                    >
                      Editar Pedido
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => this.eliminar(elemento)}
                    >
                      Eliminar Pedido
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        {/* Modal para insertar nuevo pedido */}
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <h3>Ingresar Nuevo Pedido</h3>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Lista de Productos</label>
              <select
                className="form-control"
                name="listaProductos"
                onChange={this.handleChange}
                value={this.state.form.listaProductos}
              >
                <option value="">Seleccione un producto</option>
                {this.state.productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
            </FormGroup>
            <FormGroup>
              <label>Cliente</label>
              <select
                className="form-control"
                name="cliente"
                onChange={this.handleChange}
                value={this.state.form.cliente}
              >
                <option value="">Seleccione un cliente</option>
                {this.state.clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </FormGroup>
            <FormGroup>
              <label>Fecha Carga</label>
              <input
                className="form-control"
                name="fechaCarga"
                type="date"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Fecha Entrega</label>
              <input
                className="form-control"
                name="fechaEntrega"
                type="date"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Saldo Total</label>
              <input
                className="form-control"
                name="saldoTotal"
                type="number"
                onChange={this.handleChange}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="info" onClick={this.guardarPedido}>
              Guardar Pedido
            </Button>
            <Button color="danger" onClick={this.ocultarModalInsertar}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default AbmPedidos;
