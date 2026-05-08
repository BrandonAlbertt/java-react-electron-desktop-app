import { Image, FileMusic } from "lucide-react";

export default function UploadBox({ title, description, extra, type = "image" }) {
  const Icon = type === "music" ? FileMusic : Image;

  return (
    <div className="rounded-2xl border border-dashed border-fuchsia-500/35 bg-black/20 p-4 text-center">
      <p className="mb-4 font-bold text-fuchsia-300">{title}</p>

      <div className="mx-auto mb-4 flex h-10 w-20 items-center justify-center rounded-2xl border border-fuchsia-400/50 bg-fuchsia-500/20 shadow-[0_0_20px_rgba(217,70,239,0.35)]">
        <Icon size={20} className="text-fuchsia-300" />
      </div>

      <p className="text-sm leading-5 text-white/55">{description}</p>
      <p className="mt-1 text-sm leading-5 text-white/40">{extra}</p>
    </div>
  );
}
