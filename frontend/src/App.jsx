import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [datos, setDatos] = useState({
    mensaje: "Cargando...",
    estado: "cargando",
    hora: "-"
  });

  const [error, setError] = useState("");
  const [temaOscuro, setTemaOscuro] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8080/api/saludo");

        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }

        const data = await res.json();

        setDatos({
          mensaje: data.mensaje ?? "Sin mensaje",
          estado: data.estado ?? "ok",
          hora: data.hora ?? "-"
        });

        setError("");
      } catch (err) {
        console.error("Error al conectar con Java backend:", err);
        setError(`No se pudo conectar con el backend Java: ${err.message}`);
      }
    };

    obtenerDatos();
    const intervalo = setInterval(obtenerDatos, 3000);

    return () => clearInterval(intervalo);
  }, []);

  const cambiarTema = () => {
    setTemaOscuro(!temaOscuro);
  };

  return (
    <div
      className={
        temaOscuro
          ? "h-screen w-screen bg-neutral-950 text-white flex flex-col"
          : "h-screen w-screen bg-gray-100 text-gray-900 flex flex-col"
      }
    >
      <header
        className={
          temaOscuro
            ? "h-12 flex items-center justify-between px-4 bg-neutral-900 border-b border-white/10"
            : "h-12 flex items-center justify-between px-4 bg-white border-b border-gray-300"
        }
        style={{ WebkitAppRegion: "drag" }}
      >
        <span className="font-semibold">Mi App Desktop</span>

        <div
          className="flex gap-2 items-center"
          style={{ WebkitAppRegion: "no-drag" }}
        >
          <button
            onClick={cambiarTema}
            className={
              temaOscuro
                ? "px-3 h-8 bg-white/10 hover:bg-white/20 rounded text-sm"
                : "px-3 h-8 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            }
          >
            {temaOscuro ? "☀" : "🌙"}
          </button>

          <button
            onClick={() => window.electronAPI?.minimize()}
            className={
              temaOscuro
                ? "w-8 h-8 bg-white/10 hover:bg-white/20 rounded"
                : "w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded"
            }
          >
            —
          </button>

          <button
            onClick={() => window.electronAPI?.maximize()}
            className={
              temaOscuro
                ? "w-8 h-8 bg-white/10 hover:bg-white/20 rounded"
                : "w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded"
            }
          >
            □
          </button>

          <button
            onClick={() => window.electronAPI?.close()}
            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            ✕
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div
          className={
            temaOscuro
              ? "w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl"
              : "w-full max-w-4xl rounded-2xl border border-gray-300 bg-white p-8 shadow-xl"
          }
        >
          <h1 className="text-4xl font-bold mb-6">
            App escritorio moderna
          </h1>

          <div className="space-y-3 text-lg">
            <p><span className="font-semibold">Mensaje:</span> {datos.mensaje}</p>
            <p><span className="font-semibold">Estado:</span> {datos.estado}</p>
            <p><span className="font-semibold">Hora backend:</span> {datos.hora}</p>

            {error && (
              <p className="text-red-400 font-medium">{error}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;