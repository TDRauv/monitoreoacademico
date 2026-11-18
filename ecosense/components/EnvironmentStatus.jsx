"use client";

import { Leaf, AlertTriangle, CheckCircle2, Lightbulb, Volume2 } from "lucide-react";

export default function EnvironmentStatus({ ruido, luz, ruidoVal = 0, luxVal = 400, umbrales }) {
  const rMin = umbrales?.ruidoMin ?? 300;
  const rMax = umbrales?.ruidoMax ?? 2500;
  const lMin = umbrales?.luxMin ?? 300;
  const lMax = umbrales?.luxMax ?? 1000;

  const apto = ruido === "APTO" && luz === "APTA";

  const obtenerRecomendaciones = () => {
    const acciones = [];

    if (ruidoVal < rMin) {
      acciones.push({
        icono: <Volume2 size={16} style={{ color: "#d97706", flexShrink: 0, marginTop: "2px" }} />,
        texto: `Nivel acústico por debajo del mínimo (${ruidoVal} < ${rMin} ADC): Verificar sensibilidad del micrófono KY-038 o confirmar si el recinto está sin actividad.`,
      });
    } else if (ruidoVal > rMax) {
      acciones.push({
        icono: <Volume2 size={16} style={{ color: "#dc2626", flexShrink: 0, marginTop: "2px" }} />,
        texto: `Nivel acústico supera el máximo permitido (${ruidoVal} > ${rMax} ADC): Cerrar puertas/ventanas, reducir fuentes de ruido o activar aislamiento acústico.`,
      });
    }

    if (luxVal < lMin) {
      acciones.push({
        icono: <Lightbulb size={16} style={{ color: "#d97706", flexShrink: 0, marginTop: "2px" }} />,
        texto: `Iluminación inferior al mínimo apto (${Math.round(luxVal)} < ${lMin} lux): Encender luminarias auxiliares o abrir persianas para evitar fatiga visual.`,
      });
    } else if (luxVal > lMax) {
      acciones.push({
        icono: <Lightbulb size={16} style={{ color: "#dc2626", flexShrink: 0, marginTop: "2px" }} />,
        texto: `Iluminación superior al máximo apto (${Math.round(luxVal)} > ${lMax} lux): Regular persianas o atenuar luces para evitar deslumbramiento en pantallas.`,
      });
    }

    if (acciones.length === 0) {
      acciones.push({
        icono: <CheckCircle2 size={16} style={{ color: "#059669", flexShrink: 0, marginTop: "2px" }} />,
        texto: `Condiciones ambientales dentro de los rangos aptos configurados (Ruido: ${rMin}–${rMax} ADC | Luz: ${lMin}–${lMax} lux). Mantener parámetros actuales.`,
      });
    }

    return acciones;
  };

  return (
    <section className={`environment-status ${apto ? "" : "warning-mode"}`}>
      <div className="environment-main">
        <div className="environment-icon">
          {apto ? <Leaf size={28} /> : <AlertTriangle size={28} />}
        </div>

        <div>
          <span className="label">Diagnóstico & Plan de Acción Ambiental</span>
          <h2 className={apto ? "good-text" : "danger-text"}>
            {apto ? "ENTORNO APTO" : "FUERA DE RANGO — APLICAR MEDIDAS"}
          </h2>

          <ul className="recommendations-list">
            {obtenerRecomendaciones().map((rec, idx) => (
              <li key={idx} className="recommendation-item">
                {rec.icono}
                <span>{rec.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="environment-decoration">🌿</div>
    </section>
  );
}