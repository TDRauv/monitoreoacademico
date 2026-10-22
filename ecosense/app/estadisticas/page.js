"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import NoiseChart from "@/components/NoiseChart";
import LightChart from "@/components/LightChart";
import {
  ArrowLeft,
  TrendingUp,
  Volume2,
  Sun,
  Award,
  AlertTriangle,
} from "lucide-react";

export default function EstadisticasPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <span className="eyebrow">ANÁLISIS DE DATOS</span>
            <h1>
              Estadísticas y <span>Métricas</span>
            </h1>
            <p>
              Consolidado de confort ambiental, distribución de picos y tendencias
              de ruido e iluminación en el tiempo.
            </p>
          </div>
        </section>

        {/* Tarjetas estadísticas */}
        <section className="statistics-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Volume2 size={20} />
            </div>
            <span>Nivel de Ruido Promedio</span>
            <strong>1,684 dB</strong>
            <small>
              <TrendingUp size={12} /> -4.2% respecto a la jornada anterior
            </small>
          </div>

          <div className="stat-card">
            <div className="stat-icon light-stat">
              <Sun size={20} />
            </div>
            <span>Iluminación Promedio</span>
            <strong>382 lux</strong>
            <small>
              <Award size={12} /> Dentro del rango óptimo recomendado
            </small>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                color: "var(--yellow)",
                background: "rgba(232, 185, 67, 0.08)",
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <span>Índice de Confort General</span>
            <strong>92%</strong>
            <small style={{ color: "var(--green)" }}>
              Condiciones adecuadas para actividades académicas
            </small>
          </div>
        </section>

        {/* Gráficos con datos del historial */}
        <section className="charts-grid statistics-charts">
          <NoiseChart />
          <LightChart />
        </section>
      </main>
    </div>
  );
}