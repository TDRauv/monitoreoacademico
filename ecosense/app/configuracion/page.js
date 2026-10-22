"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
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
  Sliders,
  Cpu,
} from "lucide-react";

export default function ConfiguracionPage() {
  const { usuario, cargando } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Parámetros de umbrales del sistema
  const [config, setConfig] = useState({
    ruidoMax: 2500,
    luxMin: 300,
    luxMax: 1000,
    notificaciones: true,
    alertasSonoras: false,
  });

  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  // Validación de privilegios
  const esAdmin = usuario?.rol === "admin";
  const esDocente = usuario?.rol === "docente";
  const esEstudiante = usuario?.rol === "estudiante";
  const puedeEditar = esAdmin;

  const handleSave = (e) => {
    e.preventDefault();
    if (!puedeEditar) return;

    setGuardadoExitoso(true);
    setTimeout(() => setGuardadoExitoso(false), 3000);
  };

  if (cargando) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar sincronizado */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        {/* Encabezado con hora real y botón móvil */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div style={{ marginTop: "18px" }}>
          <Link href="/" className="back-home">
            <ArrowLeft size={14} />
            <span>Volver al inicio</span>
          </Link>
        </div>

        {/* CASO 1: Bloqueo de acceso para Estudiantes */}
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
                background: "rgba(239, 85, 85, 0.12)",
                color: "var(--red)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <ShieldAlert size={30} />
            </div>

            <h2 style={{ fontSize: "19px", marginBottom: "8px" }}>
              Acceso Restringido
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "12px", lineHeight: 1.6 }}>
              Tu cuenta de <strong>Estudiante</strong> solo dispone de permisos
              para monitorear métricas en tiempo real. No tienes autorización
              para alterar los umbrales de los sensores.
            </p>

            <Link
              href="/"
              style={{
                display: "inline-block",
                marginTop: "18px",
                padding: "9px 16px",
                background: "rgba(32, 212, 155, 0.1)",
                border: "1px solid rgba(32, 212, 155, 0.3)",
                color: "var(--green)",
                borderRadius: "8px",
                fontSize: "11px",
                textDecoration: "none",
              }}
            >
              Regresar al Dashboard
            </Link>
          </div>
        ) : (
          /* CASO 2: Vista para Administradores y Docentes */
          <>
            <section className="page-intro" style={{ paddingTop: "10px" }}>
              <div>
                <span className="eyebrow">AJUSTES DEL SISTEMA</span>
                <h1>
                  Configuración de <span>Sensores</span>
                </h1>
                <p>
                  Calibración de umbrales analógicos y parámetros de alerta para
                  el nodo ESP32.
                </p>
              </div>
            </section>

            {/* Banner de solo lectura para docentes */}
            {esDocente && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(41, 188, 232, 0.08)",
                  border: "1px solid rgba(41, 188, 232, 0.25)",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "12px",
                  color: "var(--cyan)",
                }}
              >
                <Lock size={16} />
                <span>
                  <strong>Modo Solo Lectura (Docente):</strong> Puedes consultar
                  los valores configurados, pero solo los <strong>Administradores</strong>{" "}
                  pueden guardar cambios.
                </span>
              </div>
            )}

            {/* Notificación de guardado */}
            {guardadoExitoso && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(32, 212, 155, 0.12)",
                  border: "1px solid rgba(32, 212, 155, 0.3)",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "12px",
                  color: "var(--green)",
                }}
              >
                <CheckCircle2 size={16} />
                <span>Parámetros guardados y sincronizados con el ESP32.</span>
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="settings-grid">
                {/* Tarjeta de Ruido */}
                <div className="settings-card">
                  <div className="settings-title">
                    <div className="settings-icon">
                      <Volume2 size={24} />
                    </div>
                    <div>
                      <h3>Umbral de Ruido</h3>
                      <span>Límite de alerta acústica</span>
                    </div>
                  </div>

                  <div className="setting-control">
                    <label>Límite máximo permitido</label>
                    <div
                      className="number-input"
                      style={{ opacity: puedeEditar ? 1 : 0.6 }}
                    >
                      <input
                        type="number"
                        disabled={!puedeEditar}
                        value={config.ruidoMax}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            ruidoMax: Number(e.target.value),
                          })
                        }
                      />
                      <span>ADC</span>
                    </div>
                    <small>
                      Mediciones por encima de este valor marcan el ambiente en
                      estado PELIGRO.
                    </small>
                  </div>
                </div>

                {/* Tarjeta de Iluminación */}
                <div className="settings-card">
                  <div className="settings-title">
                    <div className="settings-icon light-settings">
                      <Sun size={24} />
                    </div>
                    <div>
                      <h3>Rango de Iluminación</h3>
                      <span>Confort visual en aulas</span>
                    </div>
                  </div>

                  <div className="setting-control">
                    <label>Luz mínima deseada</label>
                    <div
                      className="number-input"
                      style={{ opacity: puedeEditar ? 1 : 0.6 }}
                    >
                      <input
                        type="number"
                        disabled={!puedeEditar}
                        value={config.luxMin}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            luxMin: Number(e.target.value),
                          })
                        }
                      />
                      <span>lux</span>
                    </div>
                  </div>

                  <div className="setting-control">
                    <label>Luz máxima recomendada</label>
                    <div
                      className="number-input"
                      style={{ opacity: puedeEditar ? 1 : 0.6 }}
                    >
                      <input
                        type="number"
                        disabled={!puedeEditar}
                        value={config.luxMax}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            luxMax: Number(e.target.value),
                          })
                        }
                      />
                      <span>lux</span>
                    </div>
                    <small>Rango estándar para estudio y trabajo con pantallas.</small>
                  </div>
                </div>
              </div>

              {/* Botón Guardar / Estado de Edición */}
              <div className="save-settings">
                {puedeEditar ? (
                  <button type="submit" className="save-button">
                    <Save size={15} />
                    <span>Guardar Configuración</span>
                  </button>
                ) : (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "10px 0",
                    }}
                  >
                    <Lock size={14} />
                    Edición deshabilitada para tu rol
                  </div>
                )}
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}