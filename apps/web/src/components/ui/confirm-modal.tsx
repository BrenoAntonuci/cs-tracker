'use client'

interface ConfirmModalProps {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmStyles =
    variant === 'danger'
      ? 'bg-red-500 hover:bg-red-600 text-white'
      : 'bg-yellow-500 hover:bg-yellow-600 text-cs-dark'

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-cs-card border border-cs-border rounded-2xl w-full max-w-sm p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <span className="text-red-400 text-2xl">🗑️</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{title}</h3>
            <p className="text-cs-muted text-sm mt-1">{description}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 border border-cs-border text-cs-muted rounded-lg hover:text-white hover:border-white/20 text-sm transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${confirmStyles}`}
          >
            {loading ? 'Removendo...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
