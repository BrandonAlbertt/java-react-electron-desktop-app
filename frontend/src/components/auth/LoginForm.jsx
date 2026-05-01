import { useState } from "react";

export default function LoginForm({ onBack, onLogin, onGoRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex w-full max-w-[500px] flex-col items-center gap-10">

            {/* Título */}
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

            {/* Inputs */}
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

            {/* Botón login */}
            <button
                onClick={() => onLogin({ email, password })}
                className="
                rounded-full border border-fuchsia-400 bg-black
                px-16 py-3 text-white font-bold
                shadow-[0_0_25px_rgba(217,70,239,0.9)]
                hover:scale-105 transition
                "
            >
                Iniciar sesión
            </button>

            {/* Ir a registro */}
            <button
                onClick={onGoRegister}
                className="text-white/60 hover:text-white transition text-sm"
            >
                ¿No tienes cuenta? Regístrate
            </button>
        </div>
    );
}