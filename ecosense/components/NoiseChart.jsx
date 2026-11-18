"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function NoiseChart({ historial = [], umbrales }) {
  const [rango, setRango] = useState(20);

  const rMin = Number(umbrales?.ruidoMin ?? 300);
  const rMax = Number(umbrales?.ruidoMax ?? 2500);

  const datos = [...historial]
    .slice(0, rango)
    .reverse()
    .map((m) => ({
      hora: new Date(m.created_at).toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      ruido: Number(m.ruido),
    }));

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3>Tendencia Acústica en Vivo</h3>
          <span>Umbral máximo permitido: {rMax} ADC</span>
        </div>

        <div className="chart-filter">
          {[10, 20, 30].map((n) => (
            <button
              key={n}
              type="button"
              className={rango === n ? "selected" : ""}
              onClick={() => setRango(n)}
            >
              {n} lect.
            </button>
          ))}
        </div>
      </div>

      <div className="chart">
        <ResponsiveContainer width="100%" height={245}>
          <AreaChart data={datos}>
            <defs>
              <linearGradient id="gradRuido" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
            <XAxis dataKey="hora" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} domain={[0, "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#cbd5e1",
                borderRadius: "10px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
              }}
            />
            <ReferenceLine
              y={rMax}
              stroke="#dc2626"
              strokeDasharray="5 5"
              label={{
                value: `Máx (${rMax})`,
                position: "insideTopRight",
                fill: "#dc2626",
                fontSize: 10,
                fontWeight: 700,
              }}
            />
            <ReferenceLine y={rMin} stroke="#059669" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="ruido"
              name="Ruido (ADC)"
              stroke="#059669"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#gradRuido)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}