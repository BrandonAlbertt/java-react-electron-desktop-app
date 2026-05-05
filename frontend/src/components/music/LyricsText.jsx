export default function LyricsText({ letra }) {
    if (!letra) {
        return (
            <p className="text-center text-sm text-white/45">
                Letra no disponible
            </p>
        );
    }

    const partes = letra
        .split(".")
        .map((linea) => linea.trim())
        .filter(Boolean);

    return (
        <div className="space-y-4">
            {partes.map((linea, index) => (
                <p
                    key={index}
                    className="text-center text-[clamp(0.78rem,1vw,1rem)] leading-7 text-white/85"
                >
                    {linea}.
                </p>
            ))}
        </div>
    );
}