"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  LineChart,
  PieChart,
  Settings,
  LogOut,
  UserCheck,
  X,
} from "lucide-react";

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();

  const menuBase = [
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
  ];

  // Solo Administradores y Docentes ven la pestaña de Configuración
  const tieneAccesoConfig = usuario?.rol === "admin" || usuario?.rol === "docente";

  const menu = tieneAccesoConfig
    ? [...menuBase, { nombre: "Configuración", ruta: "/configuracion", icono: Settings }]
    : menuBase;

  return (
    <>
      {/* Fondo oscuro para cerrar al tocar afuera en pantallas móviles */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        {/* Cabecera con Logo */}
        <div className="brand" style={{ padding: "0 0 25px 0", justifyContent: "space-between" }}>
          <Link
            href="/"
            onClick={onClose}
            className="brand-logo-wrap"
            style={{
              display: "block",
              width: "175px",
              height: "55px",
              position: "relative",
            }}
          >
            <Image
              src="/logo.png"
              alt="EcoSense - Monitoreo Ambiental"
              fill
              sizes="175px"
              priority
              style={{
                objectFit: "contain",
                objectPosition: "left center",
              }}
            />
          </Link>

          {/* Botón X visible únicamente en celular */}
          <button 
            type="button" 
            className="sidebar-close-btn" 
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* Enlaces de Navegación */}
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
                onClick={onClose}
                className={`nav-item ${activo ? "active" : ""}`}
              >
                <Icon size={19} />
                <span>{item.nombre}</span>
              </Link>
            );
          })}
        </nav>

        {/* Zona Inferior: Perfil, Logout y Estado */}
        <div className="sidebar-bottom">
          <div className="user-profile-badge">
            <div className="user-avatar">
              <UserCheck size={16} />
            </div>
            <div className="user-details">
              <strong>{usuario?.nombre || "Usuario"}</strong>
              <span className="user-role">{usuario?.rol?.toUpperCase() || "INVITADO"}</span>
            </div>
          </div>

          <button type="button" onClick={logout} className="logout-btn">
            <LogOut size={15} />
            <span>Cerrar Sesión</span>
          </button>

          <div className="online-indicator">
            <span></span>
            ESP32 en línea
          </div>

          <small>Dispositivo</small>
          <p>ESP32 Conectado</p>
        </div>
      </aside>
    </>
  );
}