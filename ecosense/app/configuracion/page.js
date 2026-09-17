"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Volume2,
  Sun,
  Wifi,
  Save,
  Bell,
  ArrowLeft,
} from "lucide-react";


export default function Configuracion() {

  const [ruidoMaximo, setRuidoMaximo] = useState(2500);

  const [luzMinima, setLuzMinima] = useState(300);

  const [luzMaxima, setLuzMaxima] = useState(1000);

  const [guardado, setGuardado] = useState(false);


  function guardarConfiguracion() {

    setGuardado(true);

    setTimeout(() => {
      setGuardado(false);
    }, 2500);

  }


  return (

    <main className="main-content">


      {/* ENCABEZADO */}

      <header className="top-header">

        <div className="header-info">

          <div className="connection">
            ● Sistema conectado
          </div>

        </div>

      </header>


      {/* VOLVER AL INICIO */}

      <Link
        href="/"
        className="back-home"
      >

        <ArrowLeft size={16} />

        Volver al inicio

      </Link>


      {/* INTRODUCCIÓN */}

      <section className="page-intro">

        <span className="eyebrow">
          ECOSENSE / SISTEMA
        </span>

        <h1>
          Configuración del <span>sistema</span>
        </h1>

        <p>
          Define los parámetros utilizados para determinar
          las condiciones ambientales del entorno.
        </p>

      </section>


      {/* CONFIGURACIONES */}

      <section className="settings-grid">


        {/* SENSOR DE RUIDO */}

        <div className="settings-card">

          <div className="settings-title">

            <div className="settings-icon">

              <Volume2 />

            </div>

            <div>

              <h3>
                Sensor de ruido
              </h3>

              <span>
                KY-038
              </span>

            </div>

          </div>


          <div className="setting-control">

            <label>
              Nivel máximo permitido
            </label>

            <div className="number-input">

              <input
                type="number"
                value={ruidoMaximo}
                onChange={(e) =>
                  setRuidoMaximo(e.target.value)
                }
              />

              <span>
                unidades
              </span>

            </div>

            <small>
              Si el valor supera este límite,
              el sistema clasificará el ruido como alto.
            </small>

          </div>

        </div>


        {/* SENSOR DE LUZ */}

        <div className="settings-card">

          <div className="settings-title">

            <div className="settings-icon light-settings">

              <Sun />

            </div>

            <div>

              <h3>
                Sensor de iluminación
              </h3>

              <span>
                BH1750
              </span>

            </div>

          </div>


          <div className="setting-control">

            <label>
              Nivel mínimo
            </label>

            <div className="number-input">

              <input
                type="number"
                value={luzMinima}
                onChange={(e) =>
                  setLuzMinima(e.target.value)
                }
              />

              <span>
                lux
              </span>

            </div>

          </div>


          <div className="setting-control">

            <label>
              Nivel máximo
            </label>

            <div className="number-input">

              <input
                type="number"
                value={luzMaxima}
                onChange={(e) =>
                  setLuzMaxima(e.target.value)
                }
              />

              <span>
                lux
              </span>

            </div>

          </div>

        </div>


        {/* CONEXIÓN */}

        <div className="settings-card">

          <div className="settings-title">

            <div className="settings-icon">

              <Wifi />

            </div>

            <div>

              <h3>
                Conexión
              </h3>

              <span>
                ESP32
              </span>

            </div>

          </div>


          <div className="connection-status">

            <span className="connection-circle"></span>

            <div>

              <strong>
                Dispositivo conectado
              </strong>

              <small>
                Comunicación disponible
              </small>

            </div>

          </div>

        </div>


        {/* ALERTAS */}

        <div className="settings-card">

          <div className="settings-title">

            <div className="settings-icon">

              <Bell />

            </div>

            <div>

              <h3>
                Alertas
              </h3>

              <span>
                Notificaciones
              </span>

            </div>

          </div>


          <div className="toggle-row">

            <div>

              <strong>
                Alertas de ruido
              </strong>

              <small>
                Avisar cuando el nivel sea alto
              </small>

            </div>


            <label className="switch">

              <input
                type="checkbox"
                defaultChecked
              />

              <span></span>

            </label>

          </div>


          <div className="toggle-row">

            <div>

              <strong>
                Alertas de iluminación
              </strong>

              <small>
                Avisar cuando esté fuera del rango
              </small>

            </div>


            <label className="switch">

              <input
                type="checkbox"
                defaultChecked
              />

              <span></span>

            </label>

          </div>

        </div>

      </section>


      {/* GUARDAR */}

      <div className="save-settings">

        <button
          className="save-button"
          onClick={guardarConfiguracion}
        >

          <Save size={17} />

          {guardado
            ? "Configuración guardada"
            : "Guardar configuración"}

        </button>

      </div>

    </main>

  );

}
