import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2 sm:left-auto sm:right-5 sm:translate-x-0 sm:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-obsidian-700/70 bg-obsidian-850/95 px-4 py-3 shadow-card backdrop-blur-xl animate-toast-in"
        >
          {t.variant === 'error' ? (
            <AlertCircle className="h-4 w-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-neon-green" />
          )}
          <span className="text-sm font-medium text-obsidian-100">{t.message}</span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="ml-1 rounded p-0.5 text-obsidian-300 transition-colors hover:bg-obsidian-700 hover:text-obsidian-100"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
