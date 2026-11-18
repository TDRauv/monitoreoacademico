"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle, Leaf } from "lucide-react";

export default function LoginModal() {
  const { iniciarSesion, registrarUsuario, iniciarModoDemo } = useAuth();
  const [modoRegistro, setModoRegistro] = useState(false);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);

    const res = modoRegistro
      ? await registrarUsuario(nombre, correo, password)
      : await iniciarSesion(correo, password);

    setEnviando(false);
    if (!res.ok) {
      setError(res.mensaje);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#ecfdf5",
              color: "#059669",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "10px",
              border: "1px solid #a7f3d0",
            }}
          >
            <Leaf size={26} />
          </div>
          <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 800 }}>
            ECOSENSE
          </h2>
          <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-muted)" }}>
            {modoRegistro
              ? "Registro de Cuenta Institucional"
              : "Plataforma de Monitoreo Ambiental IoT"}
          </p>
        </div>

        {error && (
          <div className="login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          {modoRegistro && (
            <div className="login-field">
              <label>Nombre completo</label>
              <div className="input-group">
                <User size={16} />
                <input
                  type="text"
                  required
                  placeholder="Ej. Laura Gómez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="login-field">
            <label>Correo institucional</label>
            <div className="input-group">
              <Mail size={16} />
              <input
                type="email"
                required
                placeholder="usuario@universidad.edu.co"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
          </div>

          <div className="login-field">
            <label>Contraseña</label>
            <div className="input-group">
              <Lock size={16} />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={enviando} className="login-btn">
            {modoRegistro ? <UserPlus size={16} /> : <LogIn size={16} />}
            <span>
              {enviando
                ? "Procesando..."
                : modoRegistro
                ? "Crear Cuenta"
                : "Ingresar al Sistema"}
            </span>
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "14px" }}>
          <button
            type="button"
            onClick={() => {
              setModoRegistro(!modoRegistro);
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#059669",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {modoRegistro
              ? "¿Ya tienes cuenta? Inicia sesión aquí"
              : "¿No tienes cuenta? Regístrate como Estudiante"}
          </button>
        </div>

        {/* Accesos rápidos para demostración */}
        <div className="login-quick">
          <small style={{ color: "var(--text-muted)", fontSize: "11px" }}>
            Accesos rápidos de demostración por rol:
          </small>
          <div className="quick-buttons">
            <button type="button" onClick={() => iniciarModoDemo("admin")}>
              Admin
            </button>
            <button type="button" onClick={() => iniciarModoDemo("docente")}>
              Docente
            </button>
            <button type="button" onClick={() => iniciarModoDemo("estudiante")}>
              Estudiante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}