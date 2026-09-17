"use client";

import {
  TrendingUp,
  TrendingDown,
  Volume2,
  Sun,
  Activity,
  CalendarDays,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const datosRuido = [
  { hora: "00:00", valor: 1320 },
  { hora: "04:00", valor: 1190 },
  { hora: "08:00", valor: 1380 },
  { hora: "10:00", valor: 1650 },
  { hora: "12:00", valor: 1842 },
  { hora: "14:00", valor: 2100 },
  { hora: "16:00", valor: 1950 },
  { hora: "18:00", valor: 2300 },
  { hora: "20:00", valor: 1850 },
  { hora: "22:00", valor: 1430 },
];

const datosLuz = [
  { hora: "00:00", valor: 330 },
  { hora: "04:00", valor: 310 },
  { hora: "08:00", valor: 385 },
  { hora: "10:00", valor: 440 },
  { hora: "12:00", valor: 356 },
  { hora: "14:00", valor: 390 },
  { hora: "16:00", valor: 410 },
  { hora: "18:00", valor: 370 },
  { hora: "20:00", valor: 340 },
  { hora: "22:00", valor: 360 },
];

export default function Estadisticas() {
  return (
    <main className="main-content">

      <header className="top-header">
        <div className="header-info">

          <div className="connection">
            ● Sistema conectado
          </div>

          <div className="header-date">
            <CalendarDays size={16} />
            17 de septiembre de 2026
          </div>

        </div>
      </header>


      <section className="page-intro">

        <span className="eyebrow">
          ECOSENSE / ANÁLISIS
        </span>

        <h1>
          Estadísticas del <span>entorno</span>
        </h1>

        <p>
          Analiza el comportamiento de las condiciones ambientales
          registradas por el sistema.
        </p>

      </section>


      {/* INDICADORES */}

      <section className="statistics-grid">

        <div className="stat-card">

          <div className="stat-icon">
            <Volume2 />
          </div>

          <span>Promedio de ruido</span>

          <strong>1.842</strong>

          <small>
            <TrendingDown size={14} />
            8.4% respecto al período anterior
          </small>

        </div>


        <div className="stat-card">

          <div className="stat-icon light-stat">
            <Sun />
          </div>

          <span>Promedio de iluminación</span>

          <strong>356 lux</strong>

          <small>
            <TrendingUp size={14} />
            5.2% respecto al período anterior
          </small>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <Activity />
          </div>

          <span>Tiempo en condiciones aptas</span>

          <strong>92.6%</strong>

          <small>
            Durante las últimas 24 horas
          </small>

        </div>

      </section>


      {/* GRÁFICAS */}

      <section className="charts-grid statistics-charts">

        <div className="chart-card">

          <div className="chart-header">

            <div>
              <h3>
                Nivel de ruido
              </h3>

              <span>
                Comportamiento durante el día
              </span>
            </div>

          </div>

          <div className="chart">

            <ResponsiveContainer width="100%" height={300}>

              <LineChart data={datosRuido}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />

                <XAxis
                  dataKey="hora"
                  stroke="#71858b"
                  fontSize={11}
                />

                <YAxis
                  stroke="#71858b"
                  fontSize={11}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#20d49b"
                  strokeWidth={3}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        <div className="chart-card">

          <div className="chart-header">

            <div>
              <h3>
                Iluminación
              </h3>

              <span>
                Nivel de luz durante el día
              </span>
            </div>

          </div>

          <div className="chart">

            <ResponsiveContainer width="100%" height={300}>

              <LineChart data={datosLuz}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />

                <XAxis
                  dataKey="hora"
                  stroke="#71858b"
                  fontSize={11}
                />

                <YAxis
                  stroke="#71858b"
                  fontSize={11}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#29bce8"
                  strokeWidth={3}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </section>

    </main>
  );
}
