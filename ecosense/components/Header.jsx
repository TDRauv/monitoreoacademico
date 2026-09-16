"use client";

import {
  Wifi,
  CalendarDays,
  Clock,
} from "lucide-react";

export default function Header() {
  return (
    <header className="top-header">

      <div className="header-spacer"></div>

      <div className="header-info">

        <div className="connection">
          <Wifi size={16} />
          Conectado
        </div>

        <div className="header-date">
          <CalendarDays size={16} />
          <span>16 de septiembre de 2026</span>
        </div>

        <div className="header-time">
          <Clock size={16} />
          <span>16:13</span>
        </div>

      </div>

    </header>
  );
}
