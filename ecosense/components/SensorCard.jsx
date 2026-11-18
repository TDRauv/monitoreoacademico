"use client";

export default function SensorCard({
  icon,
  title,
  subtitle,
  value,
  rawValue = 0,
  minVal = 0,
  maxVal = 1000,
  scaleMax = 4095,
  unit,
  status,
  limit,
  type,
}) {
  const isGood = status === "APTO" || status === "APTA";

  // Porcentajes para la barra graduada
  const safeLeft = Math.max(0, Math.min(100, (minVal / scaleMax) * 100));
  const safeWidth = Math.max(
    4,
    Math.min(100 - safeLeft, ((maxVal - minVal) / scaleMax) * 100)
  );
  const markerPos = Math.max(2, Math.min(98, (Number(rawValue) / scaleMax) * 100));

  return (
    <div className={`sensor-card ${type}`}>
      <div className="sensor-header">
        <div className="sensor-title">
          <div className="sensor-icon">{icon}</div>
          <div>
            <h3>{title}</h3>
            <span>{subtitle}</span>
          </div>
        </div>
        <div className={`status-pill ${isGood ? "good" : "danger"}`}>
          <span></span>
          {status}
        </div>
      </div>

      <div className="sensor-body">
        <div className="sensor-value">
          <strong>{value}</strong>
          <span>{unit}</span>
        </div>

        <div className="sensor-status-box">
          <p className="sensor-limit">{limit}</p>
        </div>
      </div>

      {/* Medidor Visual de Rango */}
      <div className="gauge-wrapper">
        <div className="gauge-track">
          <div
            className="gauge-safe-zone"
            style={{ left: `${safeLeft}%`, width: `${safeWidth}%` }}
            title={`Zona óptima: ${minVal} - ${maxVal}`}
          />
          <div
            className={`gauge-marker ${
              !isGood ? "danger" : type === "light" ? "cyan" : ""
            }`}
            style={{ left: `${markerPos}%` }}
          />
        </div>
        <div className="gauge-labels">
          <span>0</span>
          <span className="safe-tag">
            Zona Apta: {minVal} – {maxVal}
          </span>
          <span>{scaleMax}</span>
        </div>
      </div>
    </div>
  );
}