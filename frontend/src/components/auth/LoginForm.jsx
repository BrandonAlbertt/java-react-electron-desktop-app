import { useState } from "react";
import { useUsuario } from "../../hooks/useUsuario";

export default function LoginForm({ onBack, onLogin, onGoRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {
        iniciarSesion,
        loading,
        error,
    } = useUsuario();

    const handleSubmit = async () => {
        try {
            const response = await iniciarSesion({
                email,
                contrasena: password,
            });

            // mostrar en consola la respuesta del login
            console.log("llave: ", response.token);
            console.log("mensaje: ", response.mensaje);
            console.log("usuario id: ", response.usuario.id);
   
            // response trae: { mensaje, token, usuario }
            // Se manda a App.jsx para cambiar a Home
            onLogin(response);
        } catch (error) {
            // El error ya lo maneja el hook
            console.error("Error en LoginForm:", error);
        }
    };

    return (
        <div className="flex w-full max-w-[500px] flex-col items-center gap-10">
            <button
                onClick={onBack}
                className="
                    text-[clamp(3rem,6vw,6rem)]
                    font-light text-white
                    drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]
                "
            >
                musicBH
            </button>

            <div className="flex w-full flex-col gap-6">
                <input
                    placeholder="correo@user.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-style"
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-style"
                />
            </div>

            {error && (
                <p className="text-sm text-red-400">
                    {error}
                </p>
            )}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="
                    rounded-full border border-fuchsia-400 bg-black
                    px-16 py-3 text-white font-bold
                    shadow-[0_0_25px_rgba(217,70,239,0.9)]
                    hover:scale-105 transition disabled:opacity-50
                "
            >
                {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            <button
                onClick={onGoRegister}
                className="text-white/60 hover:text-white transition text-sm"
            >
                ¿No tienes cuenta? Regístrate
            </button>
        </div>
    );
}