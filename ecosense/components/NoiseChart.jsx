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
  { hora: "12:00", ruido: 1820 },
  { hora: "14:00", ruido: 1650 },
  { hora: "16:00", ruido: 1720 },
  { hora: "18:00", ruido: 1980 },
  { hora: "20:00", ruido: 1850 },
  { hora: "22:00", ruido: 1430 },
  { hora: "00:00", ruido: 1320 },
  { hora: "04:00", ruido: 1190 },
  { hora: "08:00", ruido: 1380 },
  { hora: "10:00", ruido: 1650 },
  { hora: "12:00", ruido: 1842 },
];

export default function NoiseChart() {

  return (
    <div className="chart-card">

      <div className="chart-header">

        <div>
          <h3>〽 Historial de ruido</h3>
          <span>Comportamiento de las últimas 24 horas</span>
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
              dataKey="ruido"
              stroke="#20d49b"
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