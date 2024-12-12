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

class AbmClientes extends React.Component {
  state = {
    data: [],
    form: {
      id: "",
      cuit: "",
      nombre: "",
    },
    modalInsertar: false,
    modalEditar: false,
  };

  componentDidMount() {
    this.obtenerClientes();
    this.cargarClientesDesdeLocalStorage();
  }

  cargarClientesDesdeLocalStorage = () => {
    const clientesGuardados = localStorage.getItem("clientes");
    if (clientesGuardados) {
      this.setState({ data: JSON.parse(clientesGuardados) });
    }
  };

  obtenerClientes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/clientes");
      this.setState({ data: response.data });
    } catch (error) {
      console.error("Error al obtener los clientes", error);
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

  mostrarModalEditar = (cliente) => {
    this.setState({ modalEditar: true, form: cliente });
  };

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  };

  guardarCliente = async () => {
    try {
      const nuevoCliente = {
        cuit: this.state.form.cuit,
        nombre: this.state.form.nombre,
      };
      const response = await axios.post(
        "http://localhost:3000/api/clientes",
        nuevoCliente
      );
      this.setState({
        data: [...this.state.data, response.data],
        form: { id: "", cuit: "", nombre: "" },
        modalInsertar: false,
      });
    } catch (error) {
      console.error("Error al guardar el cliente", error);
    }
  };

  editarCliente = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/clientes/${this.state.form.id}`,
        this.state.form
      );
      const updatedClientes = this.state.data.map((cliente) =>
        cliente.id === this.state.form.id ? this.state.form : cliente
      );
      this.setState({ data: updatedClientes, modalEditar: false });
    } catch (error) {
      console.error("Error al editar el cliente", error);
    }
  };

  eliminar = async (cliente) => {
    var opcion = window.confirm(
      "¿Estás seguro de eliminar el cliente " + cliente.id + "?"
    );
    if (opcion) {
      try {
        await axios.delete(`http://localhost:3000/api/clientes/${cliente.id}`);
        const lista = this.state.data.filter((p) => p.id !== cliente.id);
        this.setState({ data: lista });
      } catch (error) {
        console.error("Error al eliminar el cliente", error);
      }
    }
  };

  render() {
    return (
      <Container>
        <Button color="success" onClick={this.mostrarModalInsertar}>
          Guardar Nuevo Cliente
        </Button>

        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Cuit</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((elemento) => (
              <tr key={elemento.id}>
                <td>{elemento.id}</td>
                <td>{elemento.cuit}</td>
                <td>{elemento.nombre}</td>
                <td>
                  <Button
                    color="info"
                    onClick={() => this.mostrarModalEditar(elemento)}
                  >
                    Editar Cliente
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => this.eliminar(elemento)}
                  >
                    Eliminar Cliente
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para insertar nuevo cliente */}
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div>
              <h3>Ingresar Nuevo Cliente</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Cuit</label>
              <input
                className="form-control"
                name="cuit"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Nombre</label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="info" onClick={this.guardarCliente}>
              Guardar Cliente
            </Button>
            <Button color="danger" onClick={this.ocultarModalInsertar}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal para editar cliente */}
        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader>
            <div>
              <h3>Editar Cliente</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Cuit</label>
              <input
                className="form-control"
                name="cuit"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.cuit}
              />
            </FormGroup>
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
          </ModalBody>
          <ModalFooter>
            <Button color="info" onClick={this.editarCliente}>
              Editar Cliente
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

export default AbmClientes;
