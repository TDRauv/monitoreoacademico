"use client";

import { Volume2, Sun, Wifi } from "lucide-react";

export default function RealtimePanel({ datos }) {
  const ruido = datos?.ruido ?? 0;
  const lux = datos?.lux ?? 0;
  const conectado = datos?.conectado ?? false;

  return (
    <div className="realtime-panel">
      <div className="realtime-header">
        <div className="realtime-title">
          <span className="live-dot"></span>
          <h3>Telemetría en vivo</h3>
        </div>
        <span className="refresh">
          {conectado ? "SUPABASE LIVE" : "SINCRONIZANDO..."}
        </span>
      </div>

      <div className="realtime-data">
        <div className="realtime-row">
          <div className="realtime-icon">
            <Volume2 size={16} />
          </div>
          <span className="realtime-name">Sensor Acústico</span>
          <strong>{ruido.toLocaleString("es-CO")}</strong>
          <span className={`mini-status ${ruido <= 2500 ? "good" : "danger"}`}>
            {datos?.estadoRuido || "APTO"}
          </span>
        </div>

        <div className="realtime-row">
          <div className="realtime-icon">
            <Sun size={16} />
          </div>
          <span className="realtime-name">Sensor Lumínico</span>
          <strong>{Math.round(lux)} lx</strong>
          <span className="mini-status good">
            {datos?.estadoLuz || "APTA"}
          </span>
        </div>

        <div className="realtime-row" style={{ borderBottom: "none" }}>
          <div className="realtime-icon">
            <Wifi size={16} />
          </div>
          <span className="realtime-name">Nodo ESP32</span>
          <strong>{conectado ? "Online" : "Offline"}</strong>
          <span className="mini-status connected">
            {conectado ? "ACTIVO" : "ESPERA"}
          </span>
        </div>
      </div>

      <div className="realtime-wave"></div>
    </div>
  );
}