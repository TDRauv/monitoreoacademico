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

export default function LightChart({ historial = [], umbrales }) {
  const [rango, setRango] = useState(20);

  const lMin = Number(umbrales?.luxMin ?? 300);
  const lMax = Number(umbrales?.luxMax ?? 1000);

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
      lux: Number(m.lux),
    }));

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3>Tendencia de Iluminación</h3>
          <span>Rango óptimo: {lMin} – {lMax} lux</span>
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
              <linearGradient id="gradLuz" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
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
              y={lMax}
              stroke="#dc2626"
              strokeDasharray="5 5"
              label={{
                value: `Máx (${lMax})`,
                position: "insideTopRight",
                fill: "#dc2626",
                fontSize: 10,
                fontWeight: 700,
              }}
            />
            <ReferenceLine
              y={lMin}
              stroke="#d97706"
              strokeDasharray="4 4"
              label={{
                value: `Mín (${lMin})`,
                position: "insideBottomRight",
                fill: "#d97706",
                fontSize: 10,
                fontWeight: 700,
              }}
            />
            <Area
              type="monotone"
              dataKey="lux"
              name="Iluminación (lux)"
              stroke="#0284c7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#gradLuz)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}