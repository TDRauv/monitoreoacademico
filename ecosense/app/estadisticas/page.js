"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeSensors } from "@/components/useRealtimeSensors";
import { generarInformePDF } from "@/lib/exportPdf";
import LoginModal from "@/components/LoginModal";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ArrowLeft,
  Volume2,
  Sun,
  Award,
  AlertTriangle,
  Activity,
  FileDown,
} from "lucide-react";

export default function EstadisticasPage() {
  const { usuario, cargando } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { ultimaLectura, historialReciente, umbrales } = useRealtimeSensors(100);

  if (cargando) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (!usuario) {
    return <LoginModal />;
  }

  const total = historialReciente.length;

  // Cálculos reales de Ruido
  const ruidos = historialReciente.map((m) => Number(m.ruido));
  const promRuido = total ? Math.round(ruidos.reduce((a, b) => a + b, 0) / total) : 0;
  const maxRuido = total ? Math.max(...ruidos) : 0;
  const minRuido = total ? Math.min(...ruidos) : 0;

  // Cálculos reales de Iluminación
  const luces = historialReciente.map((m) => Number(m.lux));
  const promLux = total ? (luces.reduce((a, b) => a + b, 0) / total).toFixed(1) : 0;
  const maxLux = total ? Math.max(...luces).toFixed(1) : 0;
  const minLux = total ? Math.min(...luces).toFixed(1) : 0;

  // Cumplimiento por sensor
  const ruidoApto = historialReciente.filter((m) => m.estado_ruido === "APTO").length;
  const ruidoAlerta = total - ruidoApto;

  const luzApta = historialReciente.filter((m) => m.estado_luz === "APTA").length;
  const luzAlerta = total - luzApta;

  const entornoAptoTotal = historialReciente.filter(
    (m) => m.estado_ruido === "APTO" && m.estado_luz === "APTA"
  ).length;
  const indiceConfort = total ? Math.round((entornoAptoTotal / total) * 100) : 100;

  const datosComparativos = [
    {
      sensor: "Nivel Acústico",
      Optimo: ruidoApto,
      FueraDeRango: ruidoAlerta,
    },
    {
      sensor: "Iluminación",
      Optimo: luzApta,
      FueraDeRango: luzAlerta,
    },
  ];

  const datosPie = [
    { name: "Entorno Apto", value: entornoAptoTotal },
    { name: "Requiere Atención", value: total - entornoAptoTotal },
  ];

  const COLORES_PIE = ["#059669", "#dc2626"];

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
              Estadísticas y <span>Rendimiento</span>
            </h1>
            <p>
              Análisis consolidado de estabilidad, picos máximos y cumplimiento de
              umbrales sobre las últimas {total} lecturas registradas.
            </p>
          </div>

          <button
            type="button"
            className="pdf-export-btn"
            onClick={() =>
              generarInformePDF({
                mediciones: historialReciente,
                usuario,
                ultimaLectura,
                umbrales,
              })
            }
          >
            <FileDown size={17} />
            <span>Exportar Reporte Estadístico</span>
          </button>
        </section>

        {/* Tarjetas KPI reales */}
        <section className="statistics-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Volume2 size={20} />
            </div>
            <span>
              Ruido Promedio (Rango: {umbrales.ruidoMin}–{umbrales.ruidoMax})
            </span>
            <strong>{promRuido.toLocaleString("es-CO")} ADC</strong>
            <small>
              Mín: {minRuido.toLocaleString("es-CO")} | Pico máx:{" "}
              {maxRuido.toLocaleString("es-CO")}
            </small>
          </div>

          <div className="stat-card">
            <div className="stat-icon light-stat">
              <Sun size={20} />
            </div>
            <span>
              Iluminación Promedio (Rango: {umbrales.luxMin}–{umbrales.luxMax})
            </span>
            <strong>{promLux} lux</strong>
            <small>
              Mín: {minLux} lux | Máx: {maxLux} lux
            </small>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                color: indiceConfort >= 80 ? "#059669" : "#d97706",
                background: indiceConfort >= 80 ? "#ecfdf5" : "#fffbeb",
              }}
            >
              {indiceConfort >= 80 ? <Award size={20} /> : <AlertTriangle size={20} />}
            </div>
            <span>Índice de Confort Global</span>
            <strong>{indiceConfort}%</strong>
            <small style={{ color: indiceConfort >= 80 ? "#059669" : "#dc2626" }}>
              {entornoAptoTotal} de {total} mediciones cumplen ambos criterios
            </small>
          </div>
        </section>

        {/* Gráficos Analíticos */}
        <section className="charts-grid statistics-charts">
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3>
                  <Activity
                    size={15}
                    style={{ verticalAlign: "middle", marginRight: "6px" }}
                  />
                  Cumplimiento por Variable
                </h3>
                <span>Comparativa de lecturas aptas vs. alertas por sensor</span>
              </div>
            </div>

            <div className="chart">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={datosComparativos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="sensor" stroke="#526477" fontSize={12} />
                  <YAxis stroke="#526477" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#d8e2e8",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="Optimo"
                    name="En Rango Apto"
                    fill="#059669"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="FueraDeRango"
                    name="Fuera de Rango"
                    fill="#dc2626"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3>Distribución General del Ambiente</h3>
                <span>Proporción de tiempo en condiciones óptimas</span>
              </div>
            </div>

            <div className="chart">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={datosPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {datosPie.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORES_PIE[index % COLORES_PIE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#d8e2e8",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}