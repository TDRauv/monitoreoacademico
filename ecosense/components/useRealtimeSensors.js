"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const UMBRALES_DEFAULT = {
  ruidoMin: 300,
  ruidoMax: 2500,
  luxMin: 300,
  luxMax: 1000,
};

export function useRealtimeSensors(limiteRegistros = 50) {
  const [umbrales, setUmbrales] = useState(UMBRALES_DEFAULT);
  const [ultimaLectura, setUltimaLectura] = useState({
    ruido: 0,
    lux: 0,
    estadoRuido: "APTO",
    estadoLuz: "APTA",
    conectado: false,
  });
  const [historialReciente, setHistorialReciente] = useState([]);

  useEffect(() => {
    let activo = true;

    const evaluarEstado = (ruido, lux, cfg) => {
      const rOk = ruido >= cfg.ruidoMin && ruido <= cfg.ruidoMax;
      const lOk = lux >= cfg.luxMin && lux <= cfg.luxMax;
      return {
        estadoRuido: rOk ? "APTO" : "FUERA DE RANGO",
        estadoLuz: lOk ? "APTA" : "FUERA DE RANGO",
      };
    };

    async function cargarTodo() {
      // 1. Leer umbrales configurados
      const { data: cfgData } = await supabase
        .from("configuracion")
        .select("*")
        .eq("id", 1)
        .single();

      const cfgActual = cfgData
        ? {
            ruidoMin: Number(cfgData.ruido_min),
            ruidoMax: Number(cfgData.ruido_max),
            luxMin: Number(cfgData.lux_min),
            luxMax: Number(cfgData.lux_max),
          }
        : UMBRALES_DEFAULT;

      if (activo) setUmbrales(cfgActual);

      // 2. Leer mediciones reales
      const { data, error } = await supabase
        .from("mediciones")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limiteRegistros);

      if (!activo || error || !data) return;

      // Recalcular estados en vivo según los umbrales vigentes
      const medicionesEvaluadas = data.map((m) => {
        const estados = evaluarEstado(Number(m.ruido), Number(m.lux), cfgActual);
        return {
          ...m,
          estado_ruido: estados.estadoRuido,
          estado_luz: estados.estadoLuz,
        };
      });

      if (medicionesEvaluadas.length > 0) {
        const masReciente = medicionesEvaluadas[0];
        setUltimaLectura({
          ruido: Number(masReciente.ruido),
          lux: Number(masReciente.lux),
          estadoRuido: masReciente.estado_ruido,
          estadoLuz: masReciente.estado_luz,
          conectado: true,
        });
        setHistorialReciente(medicionesEvaluadas);
      }
    }

    void cargarTodo();

    const canal = supabase
      .channel("ecosense-sync-total")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mediciones" },
        () => void cargarTodo()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "configuracion" },
        () => void cargarTodo()
      )
      .subscribe();

    const intervalo = setInterval(() => {
      void cargarTodo();
    }, 3000);

    return () => {
      activo = false;
      supabase.removeChannel(canal);
      clearInterval(intervalo);
    };
  }, [limiteRegistros]);

  return { ultimaLectura, historialReciente, umbrales };
}