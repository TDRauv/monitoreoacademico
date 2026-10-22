"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, ShieldAlert, ArrowRight } from "lucide-react";

export default function LoginModal() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@universidad.edu.co");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Logo de EcoSense */}
        <div
          className="login-brand"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "230px",
              height: "75px",
              marginBottom: "8px",
            }}
          >
            <Image
              src="/logo.png"
              alt="EcoSense Logo"
              fill
              sizes="230px"
              priority
              style={{
                objectFit: "contain",
              }}
            />
          </div>

          <span
            style={{
              fontSize: "10px",
              letterSpacing: "1.6px",
              color: "var(--muted)",
              textTransform: "uppercase",
              marginTop: "4px",
            }}
          >
            Plataforma de Gestión & Monitoreo
          </span>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="login-error">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Correo Institucional</label>
            <div className="input-group">
              <Mail size={16} />
              <input
                type="email"
                required
                placeholder="ejemplo@ul.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="login-btn">
            {submitting ? "Accediendo..." : "Acceder al Dashboard"}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Accesos Rápidos de Demostración */}
        <div className="login-quick">
          <small>Cuentas de prueba rápida:</small>
          <div className="quick-buttons">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@ul.edu.co");
                setPassword("123");
              }}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("docente@ul.edu.co");
                setPassword("123");
              }}
            >
              Docente
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("estudiante@ul.edu.co");
                setPassword("123");
              }}
            >
              Estudiante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}