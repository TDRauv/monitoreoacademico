"use client";

import {
  Mic,
  Sun,
  Activity,
} from "lucide-react";

export default function RealtimePanel({ datos }) {

  return (
    <div className="realtime-panel">

      <div className="realtime-header">

        <div className="realtime-title">
          <span className="live-dot"></span>
          <h3>Datos en tiempo real</h3>
        </div>

        <span className="refresh">
          ● Actualiza cada 5 s
        </span>

      </div>


      <div className="realtime-data">

        <div className="realtime-row">

          <div className="realtime-icon">
            <Mic size={20} />
          </div>

          <div className="realtime-name">
            Ruido
          </div>

          <strong>
            {datos.ruido.toLocaleString()}
          </strong>

          <span className="mini-status good">
            {datos.estadoRuido}
          </span>

        </div>


        <div className="realtime-row">

          <div className="realtime-icon">
            <Sun size={20} />
          </div>

          <div className="realtime-name">
            Luz
          </div>

          <strong>
            {datos.lux.toFixed(0)} lux
          </strong>

          <span className="mini-status good">
            {datos.estadoLuz}
          </span>

        </div>


        <div className="realtime-row">

          <div className="realtime-icon">
            <Activity size={20} />
          </div>

          <div className="realtime-name">
            Dispositivo
          </div>

          <strong>
            ESP32
          </strong>

          <span className="mini-status connected">
            ONLINE
          </span>

        </div>

      </div>


      <div className="realtime-wave"></div>

    </div>
  );
}
