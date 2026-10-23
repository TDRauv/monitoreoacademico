"use client";

import { useSyncExternalStore } from "react";
import { useAuth } from "@/context/AuthContext";
import { Wifi, CalendarDays, Clock, Menu, LogOut } from "lucide-react";

let currentDateTimeSnapshot = null;
const listeners = new Set();

function updateSnapshot() {
  const now = new Date();
  
  const dateStr = now.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });

  const timeStr = now.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  currentDateTimeSnapshot = `${dateStr}|${timeStr}`;
}

let timerId = null;

function subscribe(callback) {
  listeners.add(callback);

  if (!timerId) {
    updateSnapshot();
    timerId = setInterval(() => {
      updateSnapshot();
      listeners.forEach((listener) => listener());
    }, 1000);
  }

  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  };
}

function getSnapshot() {
  if (!currentDateTimeSnapshot) {
    updateSnapshot();
  }
  return currentDateTimeSnapshot;
}

function getServerSnapshot() {
  return null;
}

export default function Header({ onMenuClick }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [fecha, hora] = snapshot ? snapshot.split("|") : ["--", "--:--:--"];
  const { usuario, logout } = useAuth();

  return (
    <header className="top-header">
      {/* Botón hamburguesa visible en celulares */}
      <button 
        type="button" 
        className="mobile-menu-btn" 
        onClick={onMenuClick}
        aria-label="Abrir menú"
      >
        <Menu size={22} />
      </button>

      <div className="header-info">
        <div className="connection">
          <Wifi size={14} />
          <span className="connection-text">ESP32</span>
        </div>

        <div className="header-date">
          <CalendarDays size={14} />
          <span>{fecha}</span>
        </div>

        <div className="header-time">
          <Clock size={14} />
          <span>{hora}</span>
        </div>

        {/* Botón rápido de cerrar sesión para celular / header */}
        {usuario && (
          <button
            type="button"
            onClick={logout}
            className="header-logout-btn"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut size={16} />
            <span className="header-logout-text">Salir</span>
          </button>
        )}
      </div>
    </header>
  );
}