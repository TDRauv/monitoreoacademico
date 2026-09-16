"use client";

import { Leaf } from "lucide-react";

export default function EnvironmentStatus({ ruido, luz }) {

  const apto =
    ruido === "APTO" &&
    luz === "APTA";

  return (
    <section className="environment-status">

      <div className="environment-icon">
        <Leaf size={34} />
      </div>

      <div>
        <span>
          Estado del entorno
        </span>

        <h2 className={apto ? "good-text" : "danger-text"}>
          {apto ? "APTO" : "REVISAR"}
        </h2>
      </div>

      <div className="environment-decoration">
        🌿
      </div>

    </section>
  );
}