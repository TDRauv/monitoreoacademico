"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SensorCard from "@/components/SensorCard";
import RealtimePanel from "@/components/RealtimePanel";
import EnvironmentStatus from "@/components/EnvironmentStatus";
import NoiseChart from "@/components/NoiseChart";
import LightChart from "@/components/LightChart";
import MeasurementsTable from "@/components/MeasurementsTable";

import { Volume2, Sun } from "lucide-react";

export default function Home() {
  const datos = {
    ruido: 1842,
    lux: 356.4,
    estadoRuido: "APTO",
    estadoLuz: "APTA",
  };

  return (
    <div className="app-container">

      <Sidebar />

      <main className="main-content">

        <Header />

        {/* Título */}
        <section className="page-intro">
          <div>
            <span className="eyebrow">
              UNIVERSIDAD / INGENIERÍA
            </span>

            <h1>
              Monitoreo <span>Ambiental</span>
            </h1>

            <p>
              Control en tiempo real del nivel de ruido e iluminación
              en los espacios de la universidad.
            </p>
          </div>
        </section>


        {/* Sensores principales */}
        <section className="dashboard-grid">

          <SensorCard
            type="noise"
            icon={<Volume2 size={28} />}
            title="Nivel de ruido"
            subtitle="Medición actual"
            value={datos.ruido.toLocaleString()}
            unit="valor sensor"
            status={datos.estadoRuido}
            limit="Límite: ≤ 2,500"
          />

          <SensorCard
            type="light"
            icon={<Sun size={28} />}
            title="Iluminación"
            subtitle="Medición actual"
            value={datos.lux.toFixed(0)}
            unit="lux"
            status={datos.estadoLuz}
            limit="Rango óptimo: 300 – 1,000 lux"
          />

          <RealtimePanel datos={datos} />

        </section>


        {/* Gráficas */}
        <section className="charts-grid">

          <NoiseChart />

          <LightChart />

        </section>


        {/* Estado general */}
        <EnvironmentStatus
          ruido={datos.estadoRuido}
          luz={datos.estadoLuz}
        />


        {/* Tabla */}
        <MeasurementsTable />

      </main>

    </div>
  );
}