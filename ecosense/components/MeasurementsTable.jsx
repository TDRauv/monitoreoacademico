"use client";

import { Clock, Volume2, Sun, Cpu } from "lucide-react";

export default function MeasurementsTable({ mediciones = [] }) {
  // Formatea la fecha/hora ISO de Supabase a hora local de Colombia
  const formatearFecha = (isoString) => {
    if (!isoString) return "--";
    const fecha = new Date(isoString);
    return fecha.toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <section className="table-card">
      <div className="table-header">
        <div>
          <h3>Últimas Mediciones Registradas</h3>
          <p>Sincronización en vivo con base de datos en la nube (Supabase)</p>
        </div>
        <span className="live-badge">
          <span className="pulse-dot"></span>
          TIEMPO REAL
        </span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha y Hora</th>
              <th>Dispositivo</th>
              <th>Ruido (ADC)</th>
              <th>Estado Ruido</th>
              <th>Luz (lux)</th>
              <th>Estado Luz</th>
            </tr>
          </thead>
          <tbody>
            {mediciones.length > 0 ? (
              mediciones.map((m) => (
                <tr key={m.id}>
                  <td>#{m.id}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Clock size={13} style={{ color: "var(--muted)" }} />
                      <span>{formatearFecha(m.created_at)}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Cpu size={13} style={{ color: "var(--cyan)" }} />
                      <span>{m.dispositivo || "ESP32"}</span>
                    </div>
                  </td>
                  <td>
                    <strong>{Number(m.ruido).toLocaleString("es-CO")}</strong>
                  </td>
                  <td>
                    <span
                      className={`table-status ${
                        m.estado_ruido === "APTO" ? "good" : "danger"
                      }`}
                    >
                      {m.estado_ruido}
                    </span>
                  </td>
                  <td>{Number(m.lux).toFixed(1)} lux</td>
                  <td>
                    <span
                      className={`table-status ${
                        m.estado_luz === "APTA" ? "good" : "warning"
                      }`}
                    >
                      {m.estado_luz}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "28px", color: "var(--muted)" }}>
                  Esperando lecturas desde Supabase...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}