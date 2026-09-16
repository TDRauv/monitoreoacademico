"use client";

export default function SensorCard({
  icon,
  title,
  subtitle,
  value,
  unit,
  status,
  limit,
  type,
}) {

  const isGood =
    status === "APTO" || status === "APTA";

  return (
    <div className={`sensor-card ${type}`}>

      <div className="sensor-header">

        <div className="sensor-title">

          <div className="sensor-icon">
            {icon}
          </div>

          <div>
            <h3>{title}</h3>
            <span>{subtitle}</span>
          </div>

        </div>

        <span className="arrow">
          →
        </span>

      </div>


      <div className="sensor-body">

        <div className="sensor-value">

          <strong>{value}</strong>

          <span>
            {unit}
          </span>

        </div>


        <div>

          <div
            className={`status-pill ${
              isGood ? "good" : "danger"
            }`}
          >
            <span></span>
            {status}
          </div>

          <p className="sensor-limit">
            {limit}
          </p>

        </div>

      </div>

    </div>
  );
}
