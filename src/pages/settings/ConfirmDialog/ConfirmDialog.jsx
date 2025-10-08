export default function ConfirmDialog({
  open,
  title = "Delete account?",
  description = "This action is permanent and cannot be undone.",
  confirmText = "Delete permanently",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={loading ? undefined : onCancel}
      />
      {/* dialog */}
      <div className="relative w-[92%] max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600">
            {/* warning icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v4m0 4h.01M10.34 3.94 2.6 17.01A2 2 0 0 0 4.29 20h15.42a2 2 0 0 0 1.7-2.99L13.66 3.94a2 2 0 0 0-3.32 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            <p className="mt-1 text-sm text-neutral-600">{description}</p>

            {/* type DELETE to confirm (extra safety) */}
            {/* চাইলে এই ইনপুট বাদ দিতে পারো */}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            className="h-10 rounded-xl border border-neutral-300 px-4 text-sm font-medium hover:bg-neutral-50"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-70"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent" />
                Deleting…
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
