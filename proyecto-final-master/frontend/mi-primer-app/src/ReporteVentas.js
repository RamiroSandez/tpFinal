import React, { useState, useEffect, useCallback } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";
import "./Grafico.css";

// Función para formatear la fecha en formato dd/mm/yyyy
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan desde 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    client: "",
    product: "",
  });

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [productNames, setProductNames] = useState({}); // Mapa de IDs de productos a nombres
  const [dates, setDates] = useState([]);

  // Fetch initial data for sales and filters
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Obtener datos de ventas
        const response = await axios.get("http://localhost:3000/api/pedidos");
        const formattedData = response.data.map((item) => ({
          date: formatDate(item.fechaCarga), // Usamos la función formatDate aquí
          client: item.cliente, // ID del cliente
          product: item.listaProductos, // Lista de IDs de productos
          amount: item.saldoTotal,
        }));
        setSalesData(formattedData);
        setFilteredData(formattedData);

        // Obtener datos únicos para productos y fechas
        const uniqueProducts = [
          ...new Set(response.data.flatMap((item) => item.listaProductos)),
        ];
        const uniqueDates = [
          ...new Set(response.data.map((item) => formatDate(item.fechaCarga))), // Formateamos las fechas
        ];

        setDates(uniqueDates);

        // Obtener los productos con sus IDs y nombres
        const productsResponse = await axios.get(
          "http://localhost:3000/api/productos"
        );
        const productMap = productsResponse.data.reduce((acc, product) => {
          acc[product.id] = product.nombre;
          return acc;
        }, {});

        setProducts(uniqueProducts); // Lista de IDs de productos
        setProductNames(productMap); // Mapa de ID -> Nombre

        // Obtener los clientes con ID y nombre
        const clientsResponse = await axios.get(
          "http://localhost:3000/api/clientes"
        );
        setClients(clientsResponse.data); // Contendrá { id, nombre }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchSalesData();
  }, []);

  // Apply filters to sales data
  const applyFilters = useCallback(() => {
    let data = salesData;

    if (filters.date) {
      data = data.filter((sale) => sale.date === filters.date);
    }

    if (filters.client) {
      data = data.filter((sale) => sale.client === filters.client);
    }

    if (filters.product) {
      // Filtrado de productos con nombre de productos
      data = data.filter((sale) => sale.product.includes(filters.product));
    }

    setFilteredData(data);
  }, [filters, salesData]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const chartData = {
    labels: filteredData.map((sale) => sale.date), // Usamos las fechas formateadas
    datasets: [
      {
        label: "Ventas",
        data: filteredData.map((sale) => sale.amount),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
      },
    ],
  };

  return (
    <div>
      <h1>Reporte de Ventas</h1>
      <div>
        <label>Fecha:</label>
        <select name="date" value={filters.date} onChange={handleFilterChange}>
          <option value="">Todas</option>
          {dates.map((date) => (
            <option key={date} value={date}>
              {date} {/* Mostramos las fechas formateadas */}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Cliente:</label>
        <select
          name="client"
          value={filters.client}
          onChange={handleFilterChange}
        >
          <option value="">Todos</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Producto:</label>
        <select
          name="product"
          value={filters.product}
          onChange={handleFilterChange}
        >
          <option value="">Todos</option>
          {products.map((productId) => (
            <option key={productId} value={productId}>
              {productNames[productId]} {/* Mostrar nombre del producto */}
            </option>
          ))}
        </select>
      </div>
      <div className="chart-container">
        <Line data={chartData} width={400} height={300} />
      </div>
    </div>
  );
};

export default SalesReport;
