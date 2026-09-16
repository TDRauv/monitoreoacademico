"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { hora: "12:00", lux: 430 },
  { hora: "14:00", lux: 390 },
  { hora: "16:00", lux: 410 },
  { hora: "18:00", lux: 370 },
  { hora: "20:00", lux: 340 },
  { hora: "22:00", lux: 360 },
  { hora: "00:00", lux: 330 },
  { hora: "04:00", lux: 310 },
  { hora: "08:00", lux: 385 },
  { hora: "10:00", lux: 440 },
  { hora: "12:00", lux: 356 },
];

export default function LightChart() {
  return (
    <div className="chart-card">

      <div className="chart-header">

        <div>
          <h3>☀ Historial de iluminación</h3>

          <span>
            Comportamiento de las últimas 24 horas
          </span>
        </div>

        <div className="chart-filter">

          <button className="selected">
            24 h
          </button>

          <button>
            7 días
          </button>

          <button>
            30 días
          </button>

        </div>

      </div>

      <div className="chart">

        <ResponsiveContainer width="100%" height={250}>

          <LineChart data={data}>

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
              dataKey="lux"
              stroke="#29bce8"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}