"use client";

const mediciones = [
  {
    id: 1248,
    fecha: "16 sept. 2026 - 16:13",
    ruido: 1842,
    estadoRuido: "APTO",
    lux: 356.40,
    estadoLuz: "APTA",
  },
  {
    id: 1247,
    fecha: "16 sept. 2026 - 16:12",
    ruido: 2310,
    estadoRuido: "APTO",
    lux: 412.75,
    estadoLuz: "APTA",
  },
  {
    id: 1246,
    fecha: "16 sept. 2026 - 16:11",
    ruido: 2865,
    estadoRuido: "ALTO",
    lux: 280.33,
    estadoLuz: "BAJA",
  },
  {
    id: 1245,
    fecha: "16 sept. 2026 - 16:10",
    ruido: 1620,
    estadoRuido: "APTO",
    lux: 678.21,
    estadoLuz: "APTA",
  },
];

export default function MeasurementsTable() {

  return (
    <div className="table-card">

      <div className="table-header">

        <div>
          <h3>▣ Últimas mediciones</h3>
          <span>Registro reciente del sistema</span>
        </div>

        <button>
          Ver todo el historial →
        </button>

      </div>


      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha y hora</th>
              <th>Ruido</th>
              <th>Estado ruido</th>
              <th>Luz (lux)</th>
              <th>Estado luz</th>
            </tr>
          </thead>

          <tbody>

            {mediciones.map((medicion) => (

              <tr key={medicion.id}>

                <td>
                  {medicion.id}
                </td>

                <td>
                  {medicion.fecha}
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
                  {medicion.lux.toFixed(2)}
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

    </div>
  );
}