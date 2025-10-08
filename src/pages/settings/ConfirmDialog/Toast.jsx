import { useEffect } from "react";

export default function Toast({ open, type = "success", message, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed top-4 right-4 z-[60]">
      <div
        className={`rounded-xl px-4 py-3 text-white shadow-lg transition-all ${
          type === "success" ? "bg-emerald-600" : "bg-rose-600"
        }`}
      >
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
