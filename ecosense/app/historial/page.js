"use client";

import Link from "next/link";

import {
  Search,
  Download,
  Filter,
  Volume2,
  Sun,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";

const mediciones = [
  {
    id: 1248,
    fecha: "17/09/2026",
    hora: "08:32:15",
    ruido: 1842,
    luz: 356,
    estadoRuido: "APTO",
    estadoLuz: "APTA",
  },
  {
    id: 1247,
    fecha: "17/09/2026",
    hora: "08:31:15",
    ruido: 2310,
    luz: 412,
    estadoRuido: "APTO",
    estadoLuz: "APTA",
  },
  {
    id: 1246,
    fecha: "17/09/2026",
    hora: "08:30:15",
    ruido: 2865,
    luz: 280,
    estadoRuido: "ALTO",
    estadoLuz: "BAJA",
  },
  {
    id: 1245,
    fecha: "17/09/2026",
    hora: "08:29:15",
    ruido: 1620,
    luz: 678,
    estadoRuido: "APTO",
    estadoLuz: "APTA",
  },
  {
    id: 1244,
    fecha: "17/09/2026",
    hora: "08:28:15",
    ruido: 1498,
    luz: 720,
    estadoRuido: "APTO",
    estadoLuz: "APTA",
  },
];

export default function Historial() {
  return (
    <main className="main-content">

      {/* ENCABEZADO */}

      <header className="top-header">
        <div className="header-info">

          <div className="connection">
            ● Sistema conectado
          </div>

          <div className="header-date">
            <CalendarDays size={16} />
            17 de septiembre de 2026
          </div>

        </div>
      </header>


      {/* VOLVER AL INICIO */}

      <Link href="/" className="back-home">
        <ArrowLeft size={16} />
        Volver al inicio
      </Link>


      {/* INTRODUCCIÓN */}

      <section className="page-intro">

        <span className="eyebrow">
          ECOSENSE / REGISTROS
        </span>

        <h1>
          Historial de <span>mediciones</span>
        </h1>

        <p>
          Consulta y analiza los registros obtenidos por los sensores
          de ruido e iluminación.
        </p>

      </section>


      {/* RESUMEN */}

      <section className="history-summary">

        <div className="summary-card">

          <Volume2 size={22} />

          <div>
            <span>Registros totales</span>
            <strong>1.248</strong>
          </div>

        </div>


        <div className="summary-card">

          <Volume2 size={22} />

          <div>
            <span>Promedio de ruido</span>
            <strong>1.842</strong>
          </div>

        </div>


        <div className="summary-card">

          <Sun size={22} />

          <div>
            <span>Promedio de iluminación</span>
            <strong>356 lux</strong>
          </div>

        </div>

      </section>


      {/* FILTROS */}

      <section className="history-toolbar">

        <div className="search-box">

          <Search size={17} />

          <input
            type="text"
            placeholder="Buscar medición..."
          />

        </div>


        <button className="filter-button">
          <Filter size={16} />
          Filtrar
        </button>


        <button className="export-button">
          <Download size={16} />
          Exportar
        </button>

      </section>


      {/* TABLA */}

      <section className="table-card history-table">

        <div className="table-header">

          <div>

            <h3>
              Registro de mediciones
            </h3>

            <span>
              Últimos registros obtenidos por el ESP32
            </span>

          </div>

        </div>


        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Ruido</th>
                <th>Estado</th>
                <th>Iluminación</th>
                <th>Estado</th>
              </tr>

            </thead>


            <tbody>

              {mediciones.map((medicion) => (

                <tr key={medicion.id}>

                  <td>
                    #{medicion.id}
                  </td>

                  <td>
                    {medicion.fecha}
                  </td>

                  <td>
                    {medicion.hora}
                  </td>

                  <td>
                    {medicion.ruido.toLocaleString()}
                  </td>

                  <td>

                    <span
                      className={
                        medicion.estadoRuido === "APTO"
                          ? "table-status good"
                          : "table-status danger"
                      }
                    >
                      {medicion.estadoRuido}
                    </span>

                  </td>

                  <td>
                    {medicion.luz} lux
                  </td>

                  <td>

                    <span
                      className={
                        medicion.estadoLuz === "APTA"
                          ? "table-status good"
                          : "table-status warning"
                      }
                    >
                      {medicion.estadoLuz}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}
