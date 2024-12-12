// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth"; // Añadir GoogleAuthProvider

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuA1UMsQcu8GKCDXLgUHM8hEUcF_rGLgI",
  authDomain: "tpfinal-27599.firebaseapp.com",
  projectId: "tpfinal-27599",
  storageBucket: "tpfinal-27599.firebasestorage.app",
  messagingSenderId: "780899065656",
  appId: "1:780899065656:web:5957b05bc4c0023ed62bcd",
  measurementId: "G-4CGR4M916G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Crear el proveedor de Google para el login
const googleProvider = new GoogleAuthProvider();

// Función para iniciar sesión con Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Usuario autenticado con Google: ", user);
    return user;
  } catch (error) {
    console.error("Error al iniciar sesión con Google: ", error);
  }
};

// Función para cerrar sesión
const logout = async () => {
  try {
    await signOut(auth);
    console.log("Usuario cerrado sesión");
  } catch (error) {
    console.error("Error al cerrar sesión: ", error);
  }
};

export { auth, signInWithGoogle, logout };
