"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import LoginModal from "@/components/LoginModal";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  Volume2,
  Sun,
  ShieldAlert,
  Save,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Users,
} from "lucide-react";

export default function ConfiguracionPage() {
  const { usuario, cargando } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [config, setConfig] = useState({
    ruidoMin: 300,
    ruidoMax: 2500,
    luxMin: 300,
    luxMax: 1000,
  });

  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const esAdmin = usuario?.rol === "admin";
  const esDocente = usuario?.rol === "docente";
  const esEstudiante = usuario?.rol === "estudiante";
  const puedeEditar = esAdmin;

  useEffect(() => {
    async function cargarDatos() {
      // 1. Cargar umbrales
      const { data: cfg } = await supabase
        .from("configuracion")
        .select("*")
        .eq("id", 1)
        .single();

      if (cfg) {
        setConfig({
          ruidoMin: Number(cfg.ruido_min),
          ruidoMax: Number(cfg.ruido_max),
          luxMin: Number(cfg.lux_min),
          luxMax: Number(cfg.lux_max),
        });
      }

      // 2. Cargar usuarios registrados si es admin
      if (usuario?.rol === "admin") {
        const { data: perfiles } = await supabase
          .from("perfiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (perfiles) setListaUsuarios(perfiles);
      }
    }

    if (usuario) void cargarDatos();
  }, [usuario]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!puedeEditar) return;
    setMensaje({ tipo: "", texto: "" });

    if (config.ruidoMin >= config.ruidoMax || config.luxMin >= config.luxMax) {
      setMensaje({
        tipo: "error",
        texto: "El umbral mínimo debe ser estrictamente menor que el umbral máximo.",
      });
      return;
    }

    setGuardando(true);
    const { error } = await supabase
      .from("configuracion")
      .update({
        ruido_min: Number(config.ruidoMin),
        ruido_max: Number(config.ruidoMax),
        lux_min: Number(config.luxMin),
        lux_max: Number(config.luxMax),
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setGuardando(false);

    if (error) {
      setMensaje({ tipo: "error", texto: `Error al guardar: ${error.message}` });
    } else {
      setMensaje({
        tipo: "ok",
        texto: "Umbrales actualizados en Supabase. Todo el sistema ya evalúa con los nuevos rangos.",
      });
      setTimeout(() => setMensaje({ tipo: "", texto: "" }), 4000);
    }
  };

  const cambiarRolUsuario = async (userId, nuevoRol) => {
    const { error } = await supabase
      .from("perfiles")
      .update({ rol: nuevoRol })
      .eq("id", userId);

    if (!error) {
      setListaUsuarios((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, rol: nuevoRol } : u))
      );
      setMensaje({ tipo: "ok", texto: "Rol de usuario actualizado correctamente." });
      setTimeout(() => setMensaje({ tipo: "", texto: "" }), 3000);
    }
  };

  if (cargando) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Cargando configuración...</p>
      </div>
    );
  }

  if (!usuario) return <LoginModal />;

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {esEstudiante ? (
          <div
            className="settings-card"
            style={{
              maxWidth: "550px",
              margin: "40px auto",
              textAlign: "center",
              padding: "40px 24px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#fef2f2",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                border: "1px solid #fecaca",
              }}
            >
              <ShieldAlert size={30} />
            </div>

            <h2 style={{ fontSize: "19px", marginBottom: "8px" }}>
              Acceso Restringido
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.6 }}>
              Tu cuenta de <strong>Estudiante</strong> solo dispone de permisos
              para monitorear métricas y descargar reportes. No tienes autorización
              para modificar los umbrales ni gestionar usuarios.
            </p>

            <Link href="/" className="back-home" style={{ marginTop: "18px" }}>
              Regresar al Dashboard
            </Link>
          </div>
        ) : (
          <>
            <section className="page-intro">
              <div>
                <Link href="/" className="back-home">
                  <ArrowLeft size={14} /> Volver al Panel Principal
                </Link>
                <h1>
                  Configuración y <span>Control de Acceso</span>
                </h1>
                <p>
                  Calibración de rangos aptos para el nodo ESP32 y gestión de
                  privilegios institucionales.
                </p>
              </div>
            </section>

            {esDocente && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  fontSize: "12.5px",
                  color: "#0284c7",
                }}
              >
                <Lock size={16} />
                <span>
                  <strong>Modo Solo Lectura (Docente):</strong> Puedes consultar los
                  rangos vigentes, pero solo los <strong>Administradores</strong> pueden guardar cambios.
                </span>
              </div>
            )}

            {mensaje.texto && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: mensaje.tipo === "error" ? "#fef2f2" : "#ecfdf5",
                  border: `1px solid ${mensaje.tipo === "error" ? "#fecaca" : "#a7f3d0"}`,
                  padding: "12px 18px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: mensaje.tipo === "error" ? "#dc2626" : "#059669",
                }}
              >
                <CheckCircle2 size={16} />
                <span>{mensaje.texto}</span>
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="settings-grid">
                <div className="settings-card">
                  <div className="settings-title">
                    <div className="settings-icon">
                      <Volume2 size={22} />
                    </div>
                    <div>
                      <h3>Rango Apto de Ruido</h3>
                      <span>Límites acústicos permitidos</span>
                    </div>
                  </div>

                  <div className="setting-control">
                    <label>Umbral mínimo apto</label>
                    <div className="number-input" style={{ opacity: puedeEditar ? 1 : 0.65 }}>
                      <input
                        type="number"
                        disabled={!puedeEditar}
                        value={config.ruidoMin}
                        onChange={(e) =>
                          setConfig({ ...config, ruidoMin: Number(e.target.value) })
                        }
                      />
                      <span>ADC</span>
                    </div>
                  </div>

                  <div className="setting-control">
                    <label>Umbral máximo apto</label>
                    <div className="number-input" style={{ opacity: puedeEditar ? 1 : 0.65 }}>
                      <input
                        type="number"
                        disabled={!puedeEditar}
                        value={config.ruidoMax}
                        onChange={(e) =>
                          setConfig({ ...config, ruidoMax: Number(e.target.value) })
                        }
                      />
                      <span>ADC</span>
                    </div>
                  </div>
                </div>

                <div className="settings-card">
                  <div className="settings-title">
                    <div className="settings-icon light-settings">
                      <Sun size={22} />
                    </div>
                    <div>
                      <h3>Rango Apto de Iluminación</h3>
                      <span>Confort visual en aulas</span>
                    </div>
                  </div>

                  <div className="setting-control">
                    <label>Luz mínima apta</label>
                    <div className="number-input" style={{ opacity: puedeEditar ? 1 : 0.65 }}>
                      <input
                        type="number"
                        disabled={!puedeEditar}
                        value={config.luxMin}
                        onChange={(e) =>
                          setConfig({ ...config, luxMin: Number(e.target.value) })
                        }
                      />
                      <span>lux</span>
                    </div>
                  </div>

                  <div className="setting-control">
                    <label>Luz máxima apta</label>
                    <div className="number-input" style={{ opacity: puedeEditar ? 1 : 0.65 }}>
                      <input
                        type="number"
                        disabled={!puedeEditar}
                        value={config.luxMax}
                        onChange={(e) =>
                          setConfig({ ...config, luxMax: Number(e.target.value) })
                        }
                      />
                      <span>lux</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="save-settings">
                {puedeEditar && (
                  <button type="submit" disabled={guardando} className="save-button">
                    <Save size={15} />
                    <span>{guardando ? "Guardando..." : "Guardar Configuración"}</span>
                  </button>
                )}
              </div>
            </form>

            {/* Gestión de Usuarios Institucionales (Solo visible para Admin) */}
            {esAdmin && (
              <section className="table-card" style={{ marginTop: "28px" }}>
                <div className="table-header">
                  <div>
                    <h3>
                      <Users
                        size={16}
                        style={{ verticalAlign: "middle", marginRight: "7px" }}
                      />
                      Gestión de Usuarios y Roles
                    </h3>
                    <p>
                      Asigna permisos de Administrador, Docente o Estudiante a los
                      usuarios registrados en la plataforma.
                    </p>
                  </div>
                </div>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Correo Institucional</th>
                        <th>Rol Actual</th>
                        <th>Asignar Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaUsuarios.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)" }}>
                            Aún no hay usuarios registrados con correo electrónico.
                          </td>
                        </tr>
                      ) : (
                        listaUsuarios.map((u) => (
                          <tr key={u.id}>
                            <td>
                              <strong>{u.nombre}</strong>
                            </td>
                            <td>{u.correo}</td>
                            <td>
                              <span
                                className={`table-status ${
                                  u.rol === "admin"
                                    ? "good"
                                    : u.rol === "docente"
                                    ? "warning"
                                    : ""
                                }`}
                              >
                                {u.rol.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <select
                                value={u.rol}
                                onChange={(e) => cambiarRolUsuario(u.id, e.target.value)}
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "8px",
                                  border: "1px solid var(--border-card)",
                                  background: "var(--bg-inset)",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                }}
                              >
                                <option value="estudiante">Estudiante</option>
                                <option value="docente">Docente</option>
                                <option value="admin">Administrador</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}