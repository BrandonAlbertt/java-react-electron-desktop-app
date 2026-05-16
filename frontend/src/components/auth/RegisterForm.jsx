import { useEffect, useState } from "react";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";



export default function RegisterForm({ 
    onBack, 
    onRegister,
    avataresObtenidos = [], 
    onGuardarUser = () => {},
}) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    // Mostrar avatares obtenidos en consola
    useEffect(() => {
        if (avataresObtenidos.length > 0) {
            console.log("Avatares recibidos:");
            avataresObtenidos.forEach((avatar) => {
                console.log(`ID: ${avatar.id}, Nombre: ${avatar.nombre}, URL: ${avatar.imagen_url}`);
            });
        }
    }, [avataresObtenidos]);

    const handleRegistrarUser = async () => {
        if (!username.trim() || !email.trim() || !password.trim() || !selectedAvatar) {
            alert("Por favor completa todos los campos y selecciona un avatar");
            return;
        }

        const datosUser = {
            avatar_id: selectedAvatar ? selectedAvatar.id : null,
            nombre_usuario: username,
            email: email,
            contrasena: password,
        }

        console.log("Datos para registrar usuario:", datosUser);

        const resultado = await onGuardarUser(datosUser);
     
    }

    return (
        <section className="flex w-full max-w-[980px] flex-col items-center gap-8 px-6">
            {/* Header */}
            <div className="relative flex w-full items-center justify-center">
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

            </div>

            {/* Tarjeta principal */}
            <div
              className="
                relative w-full overflow-hidden rounded-[32px]
                border border-fuchsia-400/18
                bg-[#0b0710]/95
                px-12 py-10
                shadow-[0_0_28px_rgba(168,85,247,0.13)]
                backdrop-blur-xl
              "
            >
                {/* Glow suave interno */}
                <div className="pointer-events-none absolute left-1/2 top-0 h-44 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/8 blur-3xl" />

                <div className="relative grid w-full grid-cols-[1fr_1px_1fr] items-center gap-12">
                    {/* Formulario */}
                    <div className="flex w-full max-w-[400px] flex-col gap-5 justify-self-center">
                        <h2 className="mb-3 text-xl font-semibold text-white">
                            Crea tu perfil
                        </h2>

                        <InputBox 
                            icon={<User size={18} />} 
                            placeholder="Nick Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <InputBox 
                            icon={<Mail size={18} />} 
                            placeholder="nombre@user.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputBox
                            icon={<Lock size={18} />}
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Separador */}
                    <div className="h-[250px] w-px bg-gradient-to-b from-transparent via-fuchsia-300/35 to-transparent" />

                    {/* Avatares */}
                    <div className="flex w-full max-w-[360px] flex-col items-center justify-self-center gap-7">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white">
                                Selecciona tu avatar
                            </h2>
                            <p className="mt-2 text-sm text-white/40">
                                Elige tu identidad visual
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-7">
                            {avataresObtenidos.map((avatar) => {
                                const active = selectedAvatar?.id === avatar.id;

                                return (
                                    <button
                                        key={avatar.id}
                                        type="button"
                                        onClick={() => setSelectedAvatar(avatar)}
                                        className={`
                                            relative h-[104px] w-[104px] rounded-full p-[3px] overflow-hidden
                                            transition-all duration-300
                                            ${active ? "scale-105" : "opacity-75 hover:scale-105 hover:opacity-100"}`}
                                    >
                                        <span
                                            className={`absolute inset-0 rounded-full ${active ? "bg-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.65)]" : "bg-white/8 shadow-[0_0_10px_rgba(168,85,247,0.18)]"}`}
                                        />

                                        <img
                                            src={avatar.imagen_url}
                                            alt={avatar.nombre}
                                            className="relative h-full w-full rounded-full object-cover"
                                        />

                                        {active && (
                                            <span className="absolute -bottom-2 left-1/2 h-1.5 w-9 -translate-x-1/2 rounded-full bg-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.75)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón registrar */}
            <button
              type="button"
              onClick={handleRegistrarUser}
              className="
                rounded-full border border-fuchsia-400/70 bg-black/90
                px-20 py-3 text-sm font-bold tracking-wide text-white
                shadow-[0_0_18px_rgba(217,70,239,0.45)]
                transition-all duration-300
                hover:scale-105 hover:bg-fuchsia-500/10 hover:shadow-[0_0_25px_rgba(217,70,239,0.75)]
                active:scale-95
              "
            >
                Registrar
            </button>
        </section>
    );
}

function InputBox({ icon, type = "text", placeholder, value, onChange }) {
  return (
    <label
      className="
        group flex items-center gap-3 rounded-full
        border border-white/10 bg-black/35
        px-5 py-3.5 text-white/80
        shadow-inner shadow-white/5
        transition
        focus-within:border-fuchsia-400/45
        focus-within:shadow-[0_0_14px_rgba(217,70,239,0.18)]
      "
    >
      <span className="text-fuchsia-300/70 transition group-focus-within:text-fuchsia-200">
            {icon}
      </span>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/30"
      />
    </label>
  );
}