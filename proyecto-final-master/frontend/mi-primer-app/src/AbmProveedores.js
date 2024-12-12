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

class AbmProveedores extends React.Component {
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
    this.obtenerProveedores();
  }

  obtenerProveedores = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/proveedores");
      this.setState({ data: response.data });
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

  mostrarModalEditar = (proveedor) => {
    this.setState({ modalEditar: true, form: proveedor });
  };

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  };

  guardarProveedor = async () => {
    try {
      const nuevoProveedor = {
        cuit: this.state.form.cuit,
        nombre: this.state.form.nombre,
      };
      const response = await axios.post(
        "http://localhost:3000/api/proveedores",
        nuevoProveedor
      );
      this.setState({
        data: [...this.state.data, response.data],
        form: { id: "", cuit: "", nombre: "" },
        modalInsertar: false,
      });
    } catch (error) {
      console.error("Error al guardar el proveedor", error);
    }
  };

  editarProveedor = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/proveedores/${this.state.form.id}`,
        this.state.form
      );
      const updatedProveedores = this.state.data.map((proveedor) =>
        proveedor.id === this.state.form.id ? this.state.form : proveedor
      );
      this.setState({ data: updatedProveedores, modalEditar: false });
    } catch (error) {
      console.error("Error al editar el proveedor", error);
    }
  };

  eliminar = async (proveedor) => {
    var opcion = window.confirm(
      "¿Estás seguro de eliminar el proveedor " + proveedor.id + "?"
    );
    if (opcion) {
      try {
        await axios.delete(
          `http://localhost:3000/api/proveedores/${proveedor.id}`
        );
        const lista = this.state.data.filter((p) => p.id !== proveedor.id);
        this.setState({ data: lista });
      } catch (error) {
        console.error("Error al eliminar el proveedor", error);
      }
    }
  };

  render() {
    return (
      <Container>
        <Button color="success" onClick={this.mostrarModalInsertar}>
          Guardar Nuevo Proveedor
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
                    Editar Proveedor
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => this.eliminar(elemento)}
                  >
                    Eliminar Proveedor
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para insertar nuevo proveedor */}
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div>
              <h3>Ingresar Nuevo Proveedor</h3>
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
            <Button color="info" onClick={this.guardarProveedor}>
              Guardar Proveedor
            </Button>
            <Button color="danger" onClick={this.ocultarModalInsertar}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal para editar proveedor */}
        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader>
            <div>
              <h3>Editar Proveedor</h3>
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
            <Button color="info" onClick={this.editarProveedor}>
              Editar Proveedor
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

export default AbmProveedores;
