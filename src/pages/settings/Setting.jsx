// Setting.jsx
import { useContext, useState } from "react";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export default function Setting() {
  const { t, isRTL } = useLanguage();
  const { deleteAccount } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // ============ code by shakil munshi ============
  // ⬇️ smail UI state: confirm modal + toast
  // =================================================
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, ok: true, msg: "" });

  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteAccount();
    setLoading(false);

    setToast({
      open: true,
      ok: !!res.success,
      msg: res.message || (res.success ? "Account deleted." : "Failed."),
    });

    // ============ code by shakil munshi ============
    //0.8s  after login send
    // =================================================
    setTimeout(() => navigate("/login"), 800);
  };

  return (
    <div
      className="container mx-auto flex min-h-screen items-start justify-center pt-10"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-3xl p-10">
        <h1 className="text-xl text-black">{t.settings.title}</h1>
        <p className="mt-2 mb-4 text-gray-700">{t.settings.confirmationText}</p>

        <ButtonSubmit
          onClick={() => setConfirmOpen(true)}
          disabled={loading}
          text={
            <span className="flex items-center gap-2">
              {loading
                ? t?.common?.deleting || "Deleting..."
                : t.settings.deleteButton}
            </span>
          }
          className="!w-full rounded-xl bg-[#1EAEED] text-white hover:bg-[#1A96D0]"
        />
      </div>
      {/* // ============ code by shakil munshi ============
    ⬇️ Tiny toast (top-right) 
      // ================================================= */}
      {toast.open && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              toast.ok ? "bg-emerald-600" : "bg-rose-600"
            }`}
            onAnimationEnd={() => setToast((s) => ({ ...s, open: false }))}
          >
            {toast.msg}
          </div>
        </div>
      )}

      {/* ⬇️ Tiny confirm modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !loading && setConfirmOpen(false)}
          />
          <div className="relative w-[92%] max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-neutral-900">
              {t?.settings?.confirmTitle || t?.settings?.Deleteaccount}
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              {t?.settings?.confirmDialogText || t?.settings?.confirmalart}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="h-10 rounded-xl border border-neutral-300 px-4 text-sm hover:bg-neutral-50"
                onClick={() => setConfirmOpen(false)}
                disabled={loading}
              >
                {t?.common?.cancel || t?.settings?.cencel}
              </button>
              <button
                className="h-10 rounded-xl bg-[#1EAEED] px-4 text-sm font-semibold text-white hover:bg-[#1A96D0] disabled:opacity-70"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading
                  ? "Deleting…"
                  : t?.settings?.confirmCta || t?.settings?.permanentlyButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
