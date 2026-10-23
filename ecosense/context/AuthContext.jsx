"use client";

import { createContext, useContext, useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

const USUARIOS_DEMO = [
  {
    id: "usr-1",
    email: "admin@ul.edu.co",
    password: "123",
    nombre: "Administrador del Sistema",
    rol: "admin",
    dependencia: "Laboratorios de Ingeniería",
  },
  {
    id: "usr-2",
    email: "docente@ul.edu.co",
    password: "123",
    nombre: "Docente Investigador",
    rol: "docente",
    dependencia: "Facultad de Ingeniería",
  },
  {
    id: "usr-3",
    email: "estudiante@ul.edu.co",
    password: "123",
    nombre: "Estudiante de Monitoreo",
    rol: "estudiante",
    dependencia: "Ingeniería de Sistemas",
  },
];

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    // startTransition evita renders en cascada y satisface la regla de React 19 / ESLint
    startTransition(() => {
      try {
        const sesionGuardada = localStorage.getItem("ecosense_session");
        if (sesionGuardada) {
          setUsuario(JSON.parse(sesionGuardada));
        }
      } catch {
        localStorage.removeItem("ecosense_session");
      } finally {
        setCargando(false);
      }
    });
  }, []);

  const login = (email, password) => {
    const match = USUARIOS_DEMO.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!match) {
      throw new Error("Credenciales inválidas. Revisa correo y contraseña.");
    }

    const { password: _, ...userData } = match;
    setUsuario(userData);
    localStorage.setItem("ecosense_session", JSON.stringify(userData));
    router.push("/");
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("ecosense_session");
    // Redirige a la raíz para que se desmonte la vista actual y aparezca de inmediato el login
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);