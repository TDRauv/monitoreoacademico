"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/LoginModal";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SensorCard from "@/components/SensorCard";
import RealtimePanel from "@/components/RealtimePanel";
import EnvironmentStatus from "@/components/EnvironmentStatus";
import NoiseChart from "@/components/NoiseChart";
import LightChart from "@/components/LightChart";
import MeasurementsTable from "@/components/MeasurementsTable";

import { Volume2, Sun } from "lucide-react";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function Home() {
  const { usuario, cargando } = useAuth();
  const isClient = useIsClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [datos, setDatos] = useState({
    ruido: 1842,
    lux: 356.4,
    estadoRuido: "APTO",
    estadoLuz: "APTA",
  });

  useEffect(() => {
    if (!usuario) return;

    const interval = setInterval(() => {
      setDatos((prev) => {
        const deltaRuido = Math.floor(Math.random() * 80) - 40;
        const deltaLux = Math.random() * 20 - 10;

        const nuevoRuido = Math.max(800, Math.min(3000, prev.ruido + deltaRuido));
        const nuevoLux = Math.max(100, Math.min(1200, Number((prev.lux + deltaLux).toFixed(1))));

        return {
          ruido: nuevoRuido,
          lux: nuevoLux,
          estadoRuido: nuevoRuido <= 2500 ? "APTO" : "PELIGRO",
          estadoLuz: nuevoLux >= 300 && nuevoLux <= 1000 ? "APTA" : "FUERA DE RANGO",
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [usuario]);

  if (cargando) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Iniciando ECOSENSE...</p>
      </div>
    );
  }

  if (!usuario) {
    return <LoginModal />;
  }

  const ruidoFormateado = isClient
    ? datos.ruido.toLocaleString("es-CO")
    : datos.ruido.toString();

  const luxFormateado = Math.round(datos.lux).toString();

  return (
    <div className="app-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <section className="page-intro">
          <div>
            <span className="eyebrow">UNIVERSIDAD / INGENIERÍA</span>
            <h1>
              Monitoreo <span>Ambiental</span>
            </h1>
            <p>
              Bienvenido, {usuario.nombre}. Control en tiempo real del nivel de ruido
              e iluminación en los espacios de la universidad.
            </p>
          </div>
        </section>

        <section className="dashboard-grid">
          <SensorCard
            type="noise"
            icon={<Volume2 size={26} />}
            title="Nivel de ruido"
            subtitle="Medición actual"
            value={ruidoFormateado}
            unit="ADC (sensor)"
            status={datos.estadoRuido}
            limit="Límite: ≤ 2,500"
          />

          <SensorCard
            type="light"
            icon={<Sun size={26} />}
            title="Iluminación"
            subtitle="Medición actual"
            value={luxFormateado}
            unit="lux"
            status={datos.estadoLuz}
            limit="Rango óptimo: 300 – 1,000 lux"
          />

          <RealtimePanel datos={datos} />
        </section>

        <section className="charts-grid">
          <NoiseChart currentVal={datos.ruido} />
          <LightChart currentVal={datos.lux} />
        </section>

        <EnvironmentStatus
          ruido={datos.estadoRuido}
          luz={datos.estadoLuz}
        />

        <MeasurementsTable />
      </main>
    </div>
  );
}