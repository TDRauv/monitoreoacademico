"use client";

import { useState, useSyncExternalStore } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeSensors } from "@/components/useRealtimeSensors";
import { generarInformePDF } from "@/lib/exportPdf";
import LoginModal from "@/components/LoginModal";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SensorCard from "@/components/SensorCard";
import RealtimePanel from "@/components/RealtimePanel";
import EnvironmentStatus from "@/components/EnvironmentStatus";
import NoiseChart from "@/components/NoiseChart";
import LightChart from "@/components/LightChart";
import MeasurementsTable from "@/components/MeasurementsTable";

import { Volume2, Sun, FileDown, Cpu, Clock } from "lucide-react";

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

  const { ultimaLectura, historialReciente, umbrales } = useRealtimeSensors(30);

  if (cargando) {
    return (
      <div className="app-container" style={{ padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
          <div className="skeleton-box" style={{ height: "110px", marginBottom: "20px" }} />
          <div className="dashboard-grid">
            <div className="skeleton-box" style={{ height: "190px" }} />
            <div className="skeleton-box" style={{ height: "190px" }} />
            <div className="skeleton-box" style={{ height: "190px" }} />
          </div>
          <div className="charts-grid">
            <div className="skeleton-box" style={{ height: "310px" }} />
            <div className="skeleton-box" style={{ height: "310px" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <LoginModal />;
  }

  const ruidoFormateado = isClient
    ? ultimaLectura.ruido.toLocaleString("es-CO")
    : ultimaLectura.ruido.toString();

  const luxFormateado = Math.round(ultimaLectura.lux).toString();
  const nodoActivo = historialReciente[0]?.dispositivo || "ESP32-NODO-01";

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <section className="page-intro">
          <div>
            <span className="eyebrow">UNIVERSIDAD / INGENIERÍA</span>
            <h1>
              Monitoreo <span>Ambiental</span>
            </h1>
            <p>
              Bienvenido, <strong>{usuario.nombre}</strong>. Supervisión acústica y
              lumínica en tiempo real.
            </p>

            <div className="telemetry-meta-bar">
              <span className="node-chip">
                <Cpu size={13} color="#059669" />
                Nodo activo: <strong>{nodoActivo}</strong>
              </span>
              <span className="node-chip">
                <Clock size={13} color="#0284c7" />
                Último paquete: <strong>{ultimaLectura.hora || "Sincronizando..."}</strong>
              </span>
            </div>
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
            <span>Exportar Informe PDF</span>
          </button>
        </section>

        <section className="dashboard-grid">
          <SensorCard
            type="noise"
            icon={<Volume2 size={22} />}
            title="Nivel de ruido"
            subtitle="Sensor acústico ADC"
            value={ruidoFormateado}
            rawValue={ultimaLectura.ruido}
            minVal={umbrales.ruidoMin}
            maxVal={umbrales.ruidoMax}
            scaleMax={4095}
            unit="ADC"
            status={ultimaLectura.estadoRuido}
            limit={`Límite: ${umbrales.ruidoMin} – ${umbrales.ruidoMax}`}
          />

          <SensorCard
            type="light"
            icon={<Sun size={22} />}
            title="Iluminación"
            subtitle="Sensor lumínico ambiental"
            value={luxFormateado}
            rawValue={ultimaLectura.lux}
            minVal={umbrales.luxMin}
            maxVal={umbrales.luxMax}
            scaleMax={1500}
            unit="lux"
            status={ultimaLectura.estadoLuz}
            limit={`Límite: ${umbrales.luxMin} – ${umbrales.luxMax} lux`}
          />

          <RealtimePanel datos={ultimaLectura} />
        </section>

        <section className="charts-grid">
          <NoiseChart historial={historialReciente} umbrales={umbrales} />
          <LightChart historial={historialReciente} umbrales={umbrales} />
        </section>

        <EnvironmentStatus
          ruido={ultimaLectura.estadoRuido}
          luz={ultimaLectura.estadoLuz}
          ruidoVal={ultimaLectura.ruido}
          luxVal={ultimaLectura.lux}
          umbrales={umbrales}
        />

        <MeasurementsTable mediciones={historialReciente} />
      </main>
    </div>
  );
}