import React, { useState, useEffect, useCallback } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";
import "./Grafico.css";

const SupplierProductReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    supplier: "",
    product: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch initial data for sales and filters
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Obtener datos de ventas
        const response = await axios.get("http://localhost:3000/api/productos");
        const formattedData = response.data.map((item) => ({
          supplier: item.proveedor, // Esto debe ser el ID
          product: item.nombre,
          amount: item.precioVenta,
        }));
        setSalesData(formattedData);
        setFilteredData(formattedData);

        // Obtener datos únicos para productos
        const uniqueProducts = [
          ...new Set(response.data.map((item) => item.nombre)),
        ];

        setProducts(uniqueProducts);

        // Obtener proveedores con ID y nombre
        const suppliersResponse = await axios.get(
          "http://localhost:3000/api/proveedores"
        );
        setSuppliers(suppliersResponse.data); // Debe contener { id, nombre }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchSalesData();
  }, []);

  // Apply filters to sales data
  const applyFilters = useCallback(() => {
    let data = salesData;

    if (filters.supplier) {
      data = data.filter((sale) => sale.supplier === filters.supplier);
    }

    if (filters.product) {
      data = data.filter((sale) => sale.product === filters.product);
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
    labels: filteredData.map((sale) => sale.product),
    datasets: [
      {
        label: "Compras",
        data: filteredData.map((sale) => sale.amount),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
      },
    ],
  };

  return (
    <div>
      <h1>Reporte de Compras</h1>
      <div>
        <label>Proveedor:</label>
        <select
          name="supplier"
          value={filters.supplier}
          onChange={handleFilterChange}
        >
          <option value="">Todos</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.nombre}
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
          {products.map((product) => (
            <option key={product} value={product}>
              {product}
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

export default SupplierProductReport;
