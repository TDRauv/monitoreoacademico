"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeSensors } from "@/components/useRealtimeSensors";
import { generarInformePDF } from "@/lib/exportPdf";
import LoginModal from "@/components/LoginModal";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MeasurementsTable from "@/components/MeasurementsTable";
import {
  ArrowLeft,
  Search,
  FileDown,
  Database,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function HistorialPage() {
  const { usuario, cargando } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  const { ultimaLectura, historialReciente, umbrales } = useRealtimeSensors(100);

  if (cargando) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Cargando historial...</p>
      </div>
    );
  }

  if (!usuario) {
    return <LoginModal />;
  }

  const medicionesFiltradas = historialReciente.filter((m) => {
    const coincideTexto =
      String(m.id).includes(busqueda) ||
      (m.dispositivo || "").toLowerCase().includes(busqueda.toLowerCase());

    const esApto = m.estado_ruido === "APTO" && m.estado_luz === "APTA";
    if (filtroEstado === "APTOS") return coincideTexto && esApto;
    if (filtroEstado === "ALERTAS") return coincideTexto && !esApto;
    return coincideTexto;
  });

  const totalAptos = historialReciente.filter(
    (m) => m.estado_ruido === "APTO" && m.estado_luz === "APTA"
  ).length;
  const totalAlertas = historialReciente.length - totalAptos;

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <section className="page-intro">
          <div>
            <Link href="/" className="back-home">
              <ArrowLeft size={14} /> Volver al Panel Principal
            </Link>
            <h1>
              Historial de <span>Mediciones</span>
            </h1>
            <p>
              Bitácora cronológica completa almacenada en Supabase (Rangos aptos: Ruido{" "}
              {umbrales.ruidoMin}–{umbrales.ruidoMax} ADC | Luz {umbrales.luxMin}–
              {umbrales.luxMax} lux).
            </p>
          </div>

          <button
            type="button"
            className="pdf-export-btn"
            onClick={() =>
              generarInformePDF({
                mediciones: medicionesFiltradas,
                usuario,
                ultimaLectura,
                umbrales,
              })
            }
          >
            <FileDown size={17} />
            <span>Exportar Historial PDF</span>
          </button>
        </section>

        <section className="history-summary">
          <div className="summary-card">
            <Database size={26} />
            <div>
              <span>Total Registros</span>
              <strong>{historialReciente.length}</strong>
            </div>
          </div>

          <div className="summary-card">
            <CheckCircle size={26} />
            <div>
              <span>Lecturas en Rango Apto</span>
              <strong>{totalAptos}</strong>
            </div>
          </div>

          <div className="summary-card" style={{ color: "#dc2626" }}>
            <AlertTriangle size={26} />
            <div>
              <span>Lecturas Fuera de Rango</span>
              <strong>{totalAlertas}</strong>
            </div>
          </div>
        </section>

        <div className="history-toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar por ID o dispositivo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="filter-button"
            onClick={() =>
              setFiltroEstado((prev) =>
                prev === "TODOS" ? "APTOS" : prev === "APTOS" ? "ALERTAS" : "TODOS"
              )
            }
          >
            Filtro: <strong>{filtroEstado}</strong>
          </button>
        </div>

        <MeasurementsTable mediciones={medicionesFiltradas} />
      </main>
    </div>
  );
}