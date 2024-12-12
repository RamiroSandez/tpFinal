import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth"; // Firebase auth
import { auth } from "./config/firebase.js"; // Configuración de Firebase

import AbmProductos from "./AbmProductos.js";
import AbmProveedores from "./AbmProveedores.js";
import AbmClientes from "./AbmClientes.js";
import AbmPedidos from "./AbmPedidos.js";
import SalesReport from "./ReporteVentas.js";
import CatalogoProdu from "./CatalogoProdu.js";
import SupplierProductReport from "./ReporteCompras.js";
import { Auth } from "./components/Auth.js"; // Corregido

function App() {
  const [user, setUser] = useState(null);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    // Intentar recuperar el usuario desde localStorage solo si ya hay algo guardado
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Recuperar el usuario si existe en localStorage
    }

    // Verificar el estado de autenticación en Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Guardar el usuario en localStorage
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        setUser(null);
        localStorage.removeItem("user"); // Eliminar el usuario de localStorage si no está autenticado
      }
    });

    return () => unsubscribe();
  }, []); // El efecto se ejecuta una sola vez al montar el componente

  // Menú de navegación
  const items = [
    { label: "Productos", icon: "pi pi-star", url: "/AbmProductos" },
    { label: "Proveedores", icon: "pi pi-star", url: "/AbmProveedores" },
    { label: "Clientes", icon: "pi pi-star", url: "/AbmClientes" },
    { label: "Pedidos", icon: "pi pi-star", url: "/AbmPedidos" },
    {
      label: "Catálogo de Productos",
      icon: "pi pi-star",
      url: "/CatalogoProdu",
    },
    { label: "Reporte Ventas", icon: "pi pi-star", url: "/SalesReport" },
    { label: "Reporte Compras", icon: "pi pi-star", url: "/ReporteCompras" },
    {
      label: "Cerrar Sesión",
      icon: "pi pi-power-off",
      command: () => handleLogout(),
    },
  ];

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth); // Cerrar sesión en Firebase
      setUser(null); // Limpiar el estado del usuario
      localStorage.removeItem("user"); // Eliminar el usuario de localStorage
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Router>
      <div className="card">
        <Menubar model={items} />
      </div>
      <Routes>
        {/* Ruta pública para login */}
        <Route
          path="/"
          element={user ? <Navigate to="/AbmProductos" /> : <Auth />}
        />

        {/* Rutas protegidas */}
        <Route
          path="/AbmProductos"
          element={user ? <AbmProductos /> : <Navigate to="/" />}
        />
        <Route
          path="/AbmProveedores"
          element={user ? <AbmProveedores /> : <Navigate to="/" />}
        />
        <Route
          path="/AbmClientes"
          element={user ? <AbmClientes /> : <Navigate to="/" />}
        />
        <Route
          path="/AbmPedidos"
          element={user ? <AbmPedidos /> : <Navigate to="/" />}
        />
        <Route
          path="/CatalogoProdu"
          element={user ? <CatalogoProdu /> : <Navigate to="/" />}
        />
        <Route
          path="/SalesReport"
          element={user ? <SalesReport /> : <Navigate to="/" />}
        />
        <Route
          path="/ReporteCompras"
          element={user ? <SupplierProductReport /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
