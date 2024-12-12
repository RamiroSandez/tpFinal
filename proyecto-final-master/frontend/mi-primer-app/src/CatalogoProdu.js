import React from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Container } from "reactstrap";

class CatalogoProdu extends React.Component {
  state = {
    data: [],
  };

  componentDidMount() {
    axios
      .get("http://localhost:3000/api/productos")
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
  }

  render() {
    return (
      <Container>
        <Table className="text-center">
          <thead>
            <tr>
              <th>Nombre Comercial</th>
              <th>Precio de Venta</th>
              <th>Foto</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((elemento, index) => (
              <tr key={index}>
                <td>{elemento.nombreComercial}</td>
                <td>${elemento.precioVenta}</td>
                <td>
                  {elemento.fotoURL ? (
                    <img
                      src={elemento.fotoURL}
                      alt={elemento.nombreComercial}
                      style={{
                        maxWidth: "150px",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  ) : (
                    "Sin foto"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default CatalogoProdu;
