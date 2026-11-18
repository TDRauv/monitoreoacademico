import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generarInformePDF({
  mediciones = [],
  usuario,
  ultimaLectura,
  umbrales,
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Umbrales dinámicos (con respaldo por defecto)
  const rMin = Number(umbrales?.ruidoMin ?? 300);
  const rMax = Number(umbrales?.ruidoMax ?? 2500);
  const lMin = Number(umbrales?.luxMin ?? 300);
  const lMax = Number(umbrales?.luxMax ?? 1000);

  const fechaGeneracion = new Date().toLocaleString("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
  });

  // ==========================================
  // 1. ENCABEZADO CORPORATIVO
  // ==========================================
  doc.setFillColor(4, 36, 38); // #042426 Verde oscuro institucional
  doc.rect(0, 0, pageWidth, 38, "F");

  // Franja de acento esmeralda
  doc.setFillColor(5, 150, 105); // #059669
  doc.rect(0, 38, pageWidth, 2.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(17);
  doc.setFont("helvetica", "bold");
  doc.text("ECOSENSE", 14, 15);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(209, 250, 229);
  doc.text("INFORME TÉCNICO DE MONITOREO AMBIENTAL", 14, 22);

  doc.setFontSize(8.5);
  doc.setTextColor(148, 179, 181);
  doc.text(
    `Fecha de emisión: ${fechaGeneracion}   |   Responsable: ${usuario?.nombre || "Administrador"}`,
    14,
    31
  );

  // ==========================================
  // 2. CÁLCULOS Y MÉTRICAS CLAVE
  // ==========================================
  const total = mediciones.length;
  const ruidos = mediciones.map((m) => Number(m.ruido));
  const luces = mediciones.map((m) => Number(m.lux));

  const promRuido = total
    ? Math.round(ruidos.reduce((a, b) => a + b, 0) / total)
    : Number(ultimaLectura?.ruido || 0);
  const maxRuido = total ? Math.max(...ruidos) : promRuido;
  const minRuido = total ? Math.min(...ruidos) : promRuido;

  const promLux = total
    ? Number((luces.reduce((a, b) => a + b, 0) / total).toFixed(1))
    : Number(ultimaLectura?.lux || 0);
  const maxLux = total ? Math.max(...luces) : promLux;
  const minLux = total ? Math.min(...luces) : promLux;

  const lecturasRuidoAlto = mediciones.filter((m) => Number(m.ruido) > rMax).length;
  const lecturasRuidoBajo = mediciones.filter((m) => Number(m.ruido) < rMin).length;
  const lecturasLuzAlta = mediciones.filter((m) => Number(m.lux) > lMax).length;
  const lecturasLuzBaja = mediciones.filter((m) => Number(m.lux) < lMin).length;

  const aptos = mediciones.filter(
    (m) =>
      Number(m.ruido) >= rMin &&
      Number(m.ruido) <= rMax &&
      Number(m.lux) >= lMin &&
      Number(m.lux) <= lMax
  ).length;
  const cumplimiento = total ? Math.round((aptos / total) * 100) : 100;

  // ==========================================
  // 3. TARJETAS KPI VISUALES (3 COLUMNAS)
  // ==========================================
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("1. Indicadores Consolidados del Periodo", 14, 50);

  const cardY = 54;
  const cardW = 58;
  const cardH = 26;

  // Tarjeta 1: Nivel Acústico
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, cardY, cardW, cardH, 3, 3, "FD");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("RUIDO PROMEDIO", 18, cardY + 7);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${promRuido.toLocaleString("es-CO")} ADC`, 18, cardY + 15);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Rango apto: ${rMin} - ${rMax} ADC`, 18, cardY + 21);

  // Tarjeta 2: Iluminación
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(76, cardY, cardW, cardH, 3, 3, "FD");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("ILUMINACIÓN PROMEDIO", 80, cardY + 7);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${promLux} lux`, 80, cardY + 15);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Rango apto: ${lMin} - ${lMax} lux`, 80, cardY + 21);

  // Tarjeta 3: Índice de Cumplimiento
  const cumpleBien = cumplimiento >= 80;
  doc.setFillColor(cumpleBien ? 236 : 254, cumpleBien ? 253 : 242, cumpleBien ? 245 : 242);
  doc.setDrawColor(cumpleBien ? 167 : 254, cumpleBien ? 243 : 202, cumpleBien ? 208 : 202);
  doc.roundedRect(138, cardY, cardW, cardH, 3, 3, "FD");
  doc.setFontSize(8);
  doc.setTextColor(cumpleBien ? 6 : 153, cumpleBien ? 95 : 27, cumpleBien ? 70 : 27);
  doc.text("CONFORT AMBIENTAL", 142, cardY + 7);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(`${cumplimiento}% Apto`, 142, cardY + 15);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(`${aptos} de ${total} lecturas óptimas`, 142, cardY + 21);

  // ==========================================
  // 4. DIAGNÓSTICO Y PLAN DE ACCIÓN INTELIGENTE
  // ==========================================
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("2. Diagnóstico Técnico y Recomendaciones de Mejora", 14, 91);

  const recomendaciones = [];

  if (lecturasRuidoAlto > 0 || maxRuido > rMax) {
    recomendaciones.push({
      tipo: "ALERTA ACÚSTICA (EXCESO)",
      color: [220, 38, 38],
      bg: [254, 242, 242],
      texto: `Se registraron ${lecturasRuidoAlto} lecturas sobre el límite (${rMax} ADC), con un pico máximo de ${maxRuido.toLocaleString("es-CO")} ADC. Acción: Cerrar puertas y ventanas, controlar el aforo o instalar paneles fonoabsorbentes.`,
    });
  }

  if (lecturasRuidoBajo > 0 || (total > 0 && minRuido < rMin)) {
    recomendaciones.push({
      tipo: "AVISO ACÚSTICO (BAJO MÍNIMO)",
      color: [217, 119, 6],
      bg: [255, 251, 235],
      texto: `Se detectaron ${lecturasRuidoBajo} lecturas inferiores al mínimo (${rMin} ADC). Acción: Verificar calibración y sensibilidad del micrófono KY-038 en el nodo ESP32.`,
    });
  }

  if (lecturasLuzBaja > 0 || (total > 0 && minLux < lMin)) {
    recomendaciones.push({
      tipo: "ILUMINACIÓN INSUFICIENTE",
      color: [217, 119, 6],
      bg: [255, 251, 235],
      texto: `Se registraron ${lecturasLuzBaja} lecturas por debajo de ${lMin} lux (mínimo: ${minLux} lux). Acción: Encender luminarias auxiliares o abrir persianas para evitar fatiga visual.`,
    });
  }

  if (lecturasLuzAlta > 0 || maxLux > lMax) {
    recomendaciones.push({
      tipo: "SOBREILUMINACIÓN DETECTADA",
      color: [220, 38, 38],
      bg: [254, 242, 242],
      texto: `Se registraron ${lecturasLuzAlta} lecturas superiores a ${lMax} lux (máximo: ${maxLux} lux). Acción: Regular persianas para evitar deslumbramiento en pantallas y ahorrar energía.`,
    });
  }

  if (recomendaciones.length === 0) {
    recomendaciones.push({
      tipo: "CONDICIONES ÓPTIMAS",
      color: [5, 150, 105],
      bg: [236, 253, 245],
      texto: `Todas las mediciones (${total} registros) se mantuvieron dentro de los rangos configurados (Ruido: ${rMin}-${rMax} ADC | Luz: ${lMin}-${lMax} lux). No se requieren acciones correctivas.`,
    });
  }

  let yPos = 95;
  recomendaciones.forEach((rec) => {
    const lineas = doc.splitTextToSize(rec.texto, pageWidth - 36);
    const boxH = 10 + lineas.length * 4.5;

    doc.setFillColor(...rec.bg);
    doc.setDrawColor(...rec.color);
    doc.roundedRect(14, yPos, pageWidth - 28, boxH, 2.5, 2.5, "FD");

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...rec.color);
    doc.text(rec.tipo, 18, yPos + 5.5);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(lineas, 18, yPos + 10.5);

    yPos += boxH + 4;
  });

  // ==========================================
  // 5. TABLA DETALLADA DE TELEMETRÍA
  // ==========================================
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("3. Bitácora Detallada de Mediciones", 14, yPos + 6);

  const filas = mediciones.map((m) => [
    `#${m.id}`,
    new Date(m.created_at).toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
    m.dispositivo || "ESP32",
    `${Number(m.ruido).toLocaleString("es-CO")} ADC`,
    m.estado_ruido,
    `${Number(m.lux).toFixed(1)} lux`,
    m.estado_luz,
  ]);

  autoTable(doc, {
    startY: yPos + 10,
    head: [["ID", "Fecha / Hora", "Nodo", "Ruido", "Estado Ruido", "Iluminación", "Estado Luz"]],
    body: filas,
    theme: "grid",
    headStyles: {
      fillColor: [4, 36, 38],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [226, 232, 240],
      textColor: [15, 23, 42],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didParseCell: function (data) {
      if (data.section === "body" && (data.column.index === 4 || data.column.index === 6)) {
        const val = String(data.cell.raw || "");
        if (val === "APTO" || val === "APTA") {
          data.cell.styles.textColor = [5, 150, 105];
          data.cell.styles.fontStyle = "bold";
        } else {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
    didDrawPage: function () {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Plataforma IoT EcoSense — Reporte generado automáticamente   |   Página ${pageCount}`,
        14,
        pageHeight - 10
      );
    },
  });

  doc.save(`Informe_EcoSense_${new Date().toISOString().slice(0, 10)}.pdf`);
}