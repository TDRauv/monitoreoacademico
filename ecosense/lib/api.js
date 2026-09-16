const API_URL = "http://127.0.0.1:5000";

export async function obtenerUltimaMedicion() {
  const respuesta = await fetch(
    `${API_URL}/api/mediciones/ultima`
  );

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener la medición");
  }

  return respuesta.json();
}

export async function obtenerMediciones() {
  const respuesta = await fetch(
    `${API_URL}/api/mediciones`
  );

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener las mediciones");
  }

  return respuesta.json();
}
