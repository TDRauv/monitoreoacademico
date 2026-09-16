import "./globals.css";

export const metadata = {
  title: "ECOSENSE | Monitoreo Ambiental",
  description:
    "Sistema IoT para el monitoreo de ruido e iluminación ambiental",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}