"use client";

import {
  Home,
  LineChart,
  PieChart,
  Settings,
  Leaf,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="brand">

        <div className="brand-icon">
          <Leaf size={25} />
        </div>

        <div>
          <strong>MONITOREO</strong>
          <span>AMBIENTAL</span>
        </div>

      </div>


      <nav className="navigation">

        <a className="nav-item active">
          <Home size={19} />
          <span>Inicio</span>
        </a>

        <a className="nav-item">
          <LineChart size={19} />
          <span>Historial</span>
        </a>

        <a className="nav-item">
          <PieChart size={19} />
          <span>Estadísticas</span>
        </a>

        <a className="nav-item">
          <Settings size={19} />
          <span>Configuración</span>
        </a>

      </nav>


      <div className="sidebar-bottom">

        <div className="online-indicator">
          <span></span>
          Sistema en línea
        </div>

        <small>
          Última actualización
        </small>

        <p>
          Esperando dispositivo...
        </p>

      </div>

    </aside>
  );
}
