"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Leaf, Lock, Mail, ShieldAlert, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@ul.edu.co");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
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
        {/* Brand */}
        <div className="login-brand">
          <div className="login-icon">
            <Leaf size={32} />
          </div>
          <h1>ECOSENSE</h1>
          <span>PLATAFORMA DE GESTIÓN & MONITOREO</span>
        </div>

        {error && (
          <div className="login-error">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

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
            {submitting ? "Verificando..." : "Acceder al Dashboard"}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Cuentas Demo Rápidas */}
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
