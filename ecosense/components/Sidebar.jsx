"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  LineChart,
  PieChart,
  Settings,
  Leaf,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    {
      nombre: "Inicio",
      ruta: "/",
      icono: Home,
    },
    {
      nombre: "Historial",
      ruta: "/historial",
      icono: LineChart,
    },
    {
      nombre: "Estadísticas",
      ruta: "/estadisticas",
      icono: PieChart,
    },
    {
      nombre: "Configuración",
      ruta: "/configuracion",
      icono: Settings,
    },
  ];

  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="brand-icon">
          <Leaf size={25} />
        </div>

        <div>
          <strong>ECOSENSE</strong>
          <span>MONITOREO AMBIENTAL</span>
        </div>
      </div>

      <nav className="navigation">

        {menu.map((item) => {
          const Icon = item.icono;

          const activo =
            item.ruta === "/"
              ? pathname === "/"
              : pathname.startsWith(item.ruta);

          return (
            <Link
              key={item.ruta}
              href={item.ruta}
              className={`nav-item ${activo ? "active" : ""}`}
            >
              <Icon size={19} />
              <span>{item.nombre}</span>
            </Link>
          );
        })}

      </nav>

      <div className="sidebar-bottom">

        <div className="online-indicator">
          <span></span>
          Sistema en línea
        </div>

        <small>
          Dispositivo
        </small>

        <p>
          ESP32 conectado
        </p>

      </div>

    </aside>
  );
}