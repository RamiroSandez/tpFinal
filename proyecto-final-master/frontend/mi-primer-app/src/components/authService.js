import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";

// Registrar un usuario
export const register = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Iniciar sesión
export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Cerrar sesión
export const logout = async () => {
  return await signOut(auth);
};
