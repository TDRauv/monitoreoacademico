"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Clock,
  Volume2,
  Sun,
  Activity,
} from "lucide-react";

// Función auxiliar para generar fechas recientes dinámicas
const getRecentTime = (minutosAtras = 0) => {
  const date = new Date(Date.now() - minutosAtras * 60 * 1000);
  const fechaStr = date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const horaStr = date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${fechaStr} - ${horaStr}`;
};

export default function HistorialPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Mediciones generadas en base a la hora real
  const [mediciones] = useState([
    {
      id: 1248,
      fecha: getRecentTime(1),
      ruido: 1842,
      estadoRuido: "APTO",
      lux: 356.4,
      estadoLuz: "APTA",
    },
    {
      id: 1247,
      fecha: getRecentTime(5),
      ruido: 2310,
      estadoRuido: "APTO",
      lux: 412.75,
      estadoLuz: "APTA",
    },
    {
      id: 1246,
      fecha: getRecentTime(12),
      ruido: 2865,
      estadoRuido: "ALTO",
      lux: 280.33,
      estadoLuz: "BAJA",
    },
    {
      id: 1245,
      fecha: getRecentTime(25),
      ruido: 1620,
      estadoRuido: "APTO",
      lux: 678.21,
      estadoLuz: "APTA",
    },
    {
      id: 1244,
      fecha: getRecentTime(45),
      ruido: 1410,
      estadoRuido: "APTO",
      lux: 512.0,
      estadoLuz: "APTA",
    },
    {
      id: 1243,
      fecha: getRecentTime(90),
      ruido: 2600,
      estadoRuido: "ALTO",
      lux: 310.4,
      estadoLuz: "APTA",
    },
  ]);

  const medicionesFiltradas = mediciones.filter(
    (m) =>
      m.id.toString().includes(busqueda) ||
      m.fecha.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.estadoRuido.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.estadoLuz.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div style={{ marginTop: "18px" }}>
          <Link href="/" className="back-home">
            <ArrowLeft size={14} />
            <span>Volver al inicio</span>
          </Link>
        </div>

        <section className="page-intro" style={{ paddingTop: "10px" }}>
          <div>
            <span className="eyebrow">REGISTRO HISTÓRICO</span>
            <h1>
              Historial de <span>Mediciones</span>
            </h1>
            <p>
              Auditoría cronológica de los niveles capturados por los sensores
              ESP32 en las instalaciones.
            </p>
          </div>
        </section>

        {/* Resumen rápido */}
        <section className="history-summary">
          <div className="summary-card">
            <Activity size={24} />
            <div>
              <span>Total de lecturas hoy</span>
              <strong>{mediciones.length} registros</strong>
            </div>
          </div>

          <div className="summary-card" style={{ color: "var(--cyan)" }}>
            <Sun size={24} />
            <div>
              <span>Promedio Iluminación</span>
              <strong>425 lux</strong>
            </div>
          </div>

          <div className="summary-card" style={{ color: "var(--yellow)" }}>
            <Volume2 size={24} />
            <div>
              <span>Picos de Ruido</span>
              <strong>2 alertas</strong>
            </div>
          </div>
        </section>

        {/* Barra de herramientas */}
        <div className="history-toolbar">
          <div className="search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Buscar por ID, estado o fecha..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <button type="button" className="filter-button">
            <Filter size={15} />
            <span>Filtrar</span>
          </button>

          <button type="button" className="export-button">
            <Download size={15} />
            <span>Exportar CSV</span>
          </button>
        </div>

        {/* Tabla */}
        <div className="table-card history-table">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha y hora</th>
                  <th>Ruido (ADC)</th>
                  <th>Estado ruido</th>
                  <th>Luz (lux)</th>
                  <th>Estado luz</th>
                </tr>
              </thead>
              <tbody>
                {medicionesFiltradas.length > 0 ? (
                  medicionesFiltradas.map((m) => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>{m.fecha}</td>
                      <td>{m.ruido}</td>
                      <td>
                        <span
                          className={`table-status ${
                            m.estadoRuido === "APTO" ? "good" : "danger"
                          }`}
                        >
                          {m.estadoRuido}
                        </span>
                      </td>
                      <td>{m.lux.toFixed(2)}</td>
                      <td>
                        <span
                          className={`table-status ${
                            m.estadoLuz === "APTA" ? "good" : "warning"
                          }`}
                        >
                          {m.estadoLuz}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "30px" }}>
                      No se encontraron registros que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}