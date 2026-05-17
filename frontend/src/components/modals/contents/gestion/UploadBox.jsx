import { Image, FileMusic, RefreshCcw } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function UploadBox({
  title,
  description,
  extra,
  type = "image",
  onFileChange = () => {},
  resetKey, // when this value changes, clear internal preview/state
}) {
  const Icon = type === "music" ? FileMusic : Image;

  const inputRef = useRef(null);
  const audioRef = useRef(null);
  const prevResetRef = useRef(resetKey);

  const [previewUrl, setPreviewUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsPlaying(false);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const preview = URL.createObjectURL(file);

    setPreviewUrl(preview);
    setFileName(file.name);

    if (type === "music") {
      const audio = new Audio();
      audio.src = preview;

      audio.addEventListener("loadedmetadata", () => {
        const duracionSegundos = Math.floor(audio.duration);

        onFileChange({
          file,
          duracionSegundos,
        });
      });

      return;
    }

    onFileChange({
      file,
    });
  };

  // clear internal preview when parent requests reset
  // use resetKey identity change to trigger
  useEffect(() => {
    if (typeof resetKey === "undefined") return;
    if (prevResetRef.current === resetKey) return;

    // stop audio if playing
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    } catch (e) {}

    setIsPlaying(false);

    if (previewUrl) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch (e) {}
    }

    setPreviewUrl("");
    setFileName("");

    if (inputRef.current) inputRef.current.value = "";

    prevResetRef.current = resetKey;
  }, [resetKey]);


  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleChangeFile = (e) => {
    e.preventDefault();
    e.stopPropagation();

    inputRef.current?.click();
  };

  return (
    <div className="rounded-2xl border border-dashed border-fuchsia-500/35 bg-black/20 p-2 text-center transition hover:border-fuchsia-400/60 hover:bg-black/30">
      <p className="mb-4 font-bold text-fuchsia-300">{title}</p>

      <div className="mx-auto mb-4 flex h-12 w-20 items-center justify-center overflow-hidden rounded-2xl border border-fuchsia-400/50 bg-fuchsia-500/20 shadow-[0_0_20px_rgba(217,70,239,0.35)]">
        {previewUrl ? (
          type === "music" ? (
            <button
              type="button"
              onClick={togglePlay}
              className="text-xl text-fuchsia-300"
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
          ) : (
            <img
              src={previewUrl}
              alt="preview"
              className="h-full w-full rounded-2xl object-cover"
            />
          )
        ) : (
          <Icon size={22} className="text-fuchsia-300" />
        )}
      </div>

      <p className="text-sm leading-5 text-white/55">
        {previewUrl ? "Archivo seleccionado" : description}
      </p>

      <p className="mt-1 text-sm leading-5 text-white/40">
        {previewUrl ? "Puedes previsualizarlo o cambiarlo" : extra}
      </p>

      {previewUrl && (
        <p className="mt-3 truncate text-xs text-fuchsia-200">{fileName}</p>
      )}

      {previewUrl && type === "music" && (
        <audio
          ref={audioRef}
          src={previewUrl}
          onEnded={() => setIsPlaying(false)}
          hidden
        />
      )}

      <button
        type="button"
        onClick={handleChangeFile}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-fuchsia-400/40 bg-fuchsia-500/15 px-3 py-2 text-xs font-bold text-fuchsia-100 transition hover:bg-fuchsia-500/25"
      >
        {previewUrl && <RefreshCcw size={14} />}
        {previewUrl ? "Cambiar archivo" : "Seleccionar archivo"}
      </button>

      <input
        ref={inputRef}
        type="file"
        hidden
        accept={type === "music" ? ".mp3,.wav,.m4a,audio/*" : "image/*"}
        onChange={handleFile}
      />
    </div>
  );
}