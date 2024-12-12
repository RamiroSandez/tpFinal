import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../config/firebase"; // Importa la función de Google
import { login, register } from "./authService"; // Las funciones que ya tienes

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null); // Manejo de errores
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate("/AbmProductos"); // Redirige después del login
    } catch (error) {
      setError("Error de autenticación: " + error.message); // Mostrar error si lo hay
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle(); // Función para iniciar sesión con Google
      if (user) {
        // Guardar el usuario en localStorage
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/AbmProductos"); // Redirigir a la página de productos
      }
    } catch (error) {
      setError("Error al iniciar sesión con Google: " + error.message); // Manejo de errores
    }
  };

  return (
    <div>
      <h2>{isRegistering ? "Registro" : "Iniciar Sesión"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          {isRegistering ? "Registrar" : "Iniciar sesión"}
        </button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering
          ? "¿Ya tienes cuenta? Inicia sesión"
          : "¿No tienes cuenta? Regístrate"}
      </button>
      {/* Botón de inicio de sesión con Google */}
      <button onClick={handleGoogleLogin}>Iniciar sesión con Google</button>
      {error && <p>{error}</p>} {/* Mostrar mensaje de error si existe */}
    </div>
  );
};
