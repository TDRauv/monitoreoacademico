"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const obtenerPerfil = async (authUser) => {
    if (!authUser) return null;

    const { data: perfil } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (perfil && !perfil.activo) {
      await supabase.auth.signOut();
      return null;
    }

    return {
      id: authUser.id,
      nombre:
        perfil?.nombre ||
        authUser.user_metadata?.nombre ||
        authUser.email.split("@")[0],
      correo: authUser.email,
      rol: perfil?.rol || "estudiante",
      esDemo: false,
    };
  };

  useEffect(() => {
    let montado = true;

    async function inicializarSesion() {
      // 1. Verificar sesión demo guardada
      const demoGuardado = sessionStorage.getItem("ecosense_demo_user");
      if (demoGuardado) {
        await Promise.resolve(); // Evita setState síncrono en el efecto
        if (!montado) return;
        setUsuario(JSON.parse(demoGuardado));
        setCargando(false);
        return;
      }

      // 2. Verificar sesión real de Supabase Auth
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const perfil = await obtenerPerfil(session?.user ?? null);
      if (!montado) return;

      setUsuario(perfil);
      setCargando(false);
    }

    void inicializarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        sessionStorage.removeItem("ecosense_demo_user");
        const perfil = await obtenerPerfil(session.user);
        if (montado) {
          setUsuario(perfil);
          setCargando(false);
        }
      } else if (!sessionStorage.getItem("ecosense_demo_user")) {
        if (montado) {
          setUsuario(null);
          setCargando(false);
        }
      }
    });

    return () => {
      montado = false;
      subscription.unsubscribe();
    };
  }, []);

  const iniciarSesion = async (correo, password) => {
    sessionStorage.removeItem("ecosense_demo_user");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password,
    });

    if (error) {
      return {
        ok: false,
        mensaje: "Credenciales incorrectas o usuario no registrado.",
      };
    }

    const perfil = await obtenerPerfil(data.user);
    setUsuario(perfil);
    return { ok: true };
  };

  const registrarUsuario = async (nombre, correo, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: correo,
      password,
      options: {
        data: { nombre, rol: "estudiante" },
      },
    });

    if (error) {
      return { ok: false, mensaje: error.message };
    }

    if (data.user) {
      const perfil = await obtenerPerfil(data.user);
      setUsuario(perfil);
    }
    return { ok: true };
  };

  const iniciarModoDemo = (rolDemo) => {
    const perfilesDemo = {
      admin: {
        id: "demo-admin",
        nombre: "Admin Institucional (Demo)",
        correo: "admin@ecosense.edu.co",
        rol: "admin",
        esDemo: true,
      },
      docente: {
        id: "demo-docente",
        nombre: "Docente Investigador (Demo)",
        correo: "docente@ecosense.edu.co",
        rol: "docente",
        esDemo: true,
      },
      estudiante: {
        id: "demo-estudiante",
        nombre: "Estudiante Monitor (Demo)",
        correo: "estudiante@ecosense.edu.co",
        rol: "estudiante",
        esDemo: true,
      },
    };

    const seleccionado = perfilesDemo[rolDemo];
    sessionStorage.setItem("ecosense_demo_user", JSON.stringify(seleccionado));
    setUsuario(seleccionado);
  };

  const cerrarSesion = async () => {
    try {
      sessionStorage.removeItem("ecosense_demo_user");
      localStorage.removeItem("ecosense_user");
      setUsuario(null);
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      setUsuario(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        iniciarSesion,
        registrarUsuario,
        iniciarModoDemo,
        cerrarSesion,
        logout: cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}