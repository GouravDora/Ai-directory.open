import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X, Loader2, Upload, ClipboardPaste, FileJson, AlertCircle } from 'lucide-react';
import { useImportModal } from '@/context/ImportModalContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { createSubmission, type SubmissionInput } from '@/lib/submissions';
import type { ExportedAsset } from '@/lib/exportAsset';

function validateImported(obj: Record<string, unknown>): string | null {
  const required: (keyof ExportedAsset)[] = [
    'name', 'tagline', 'description', 'category', 'system_prompt',
    'mcp_connection_string',
  ];
  for (const key of required) {
    if (typeof obj[key] !== 'string' || !(obj[key] as string).trim()) {
      return `Missing or invalid field: ${key}`;
    }
  }
  return null;
}

function buildInput(obj: Record<string, unknown>, author: string): SubmissionInput {
  return {
    name: obj.name as string,
    tagline: obj.tagline as string,
    description: obj.description as string,
    category: obj.category as SubmissionInput['category'],
    accent: (obj.accent === 'purple' ? 'purple' : 'green') as 'green' | 'purple',
    icon_name: (obj.icon_name as string) || 'Sparkles',
    system_prompt: obj.system_prompt as string,
    framework_rules: Array.isArray(obj.framework_rules)
      ? (obj.framework_rules as string[]).join('\n')
      : (obj.framework_rules as string) || '',
    mcp_connection_string: obj.mcp_connection_string as string,
    submitted_by: author,
    is_open_source: obj.is_open_source === true,
  };
}

const inputCls =
  'w-full rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-3 py-2 text-sm text-obsidian-100 placeholder:text-obsidian-300 outline-none transition-all focus:border-emerald-500/50 focus:bg-obsidian-900/60';

export function ImportModal({ onImported }: { onImported: () => void }) {
  const { isOpen, close } = useImportModal();
  const { notify } = useToast();
  const { user } = useAuth();
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > 100_000) {
      setError('File too large (max 100 KB).');
      return;
    }
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const err = validateImported(parsed as Record<string, unknown>);
      if (err) {
        setError(err);
        return;
      }
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch {
      setError('Invalid JSON file. Please check the format.');
    }
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setError(null);
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setError('Invalid JSON. Check the syntax and try again.');
      return;
    }
    const err = validateImported(parsed);
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    const input = buildInput(parsed, user?.name ?? 'Anonymous');
    const ok = await createSubmission(input);
    setSubmitting(false);
    if (ok) {
      notify('Imported asset published to the board!');
      setJsonText('');
      close();
      onImported();
    } else {
      setError('Could not publish — running in local mode.');
    }
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) close();
      }}
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-obsidian-950/80 px-4 py-8 backdrop-blur-sm sm:py-16"
    >
      <div className="relative w-full max-w-2xl animate-slide-down rounded-2xl border border-obsidian-700/70 bg-obsidian-900/95 shadow-card backdrop-blur-xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-obsidian-700/60 px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-obsidian-100">
              Import an asset
            </h2>
            <p className="mt-0.5 text-xs text-obsidian-300">
              Upload a JSON file or paste JSON to publish a new submission.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="grid h-8 w-8 place-items-center rounded-lg text-obsidian-300 transition-colors hover:bg-obsidian-700/60 hover:text-obsidian-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto px-5 py-5">
          {/* Upload + Paste buttons */}
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-95"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload .json file
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  if (text.trim()) {
                    setJsonText(text);
                    setError(null);
                    notify('Pasted from clipboard!');
                  }
                } catch {
                  notify('Could not read clipboard.', 'error');
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-obsidian-700/70 bg-obsidian-800/80 px-3 py-2 text-xs font-medium text-obsidian-100 transition-all hover:border-obsidian-500 active:scale-95"
            >
              <ClipboardPaste className="h-3.5 w-3.5" />
              Paste from clipboard
            </button>
          </div>

          {/* JSON textarea */}
          <div className="mt-4">
            <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-obsidian-100">
              <FileJson className="h-3.5 w-3.5" />
              Asset JSON
            </label>
            <textarea
              className={`${inputCls} min-h-[200px] resize-y font-mono text-xs`}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder={'{\n  "name": "My Tool",\n  "tagline": "...",\n  "description": "...",\n  "category": "MCP Server",\n  "system_prompt": "...",\n  "mcp_connection_string": "..."\n}'}
            />
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-obsidian-700/60 pt-5">
            <button
              type="button"
              onClick={close}
              className="btn-primary border border-obsidian-700/70 bg-obsidian-850/60 text-obsidian-200 hover:text-obsidian-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !jsonText.trim()}
              className="btn-primary border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {submitting ? 'Publishing…' : 'Import & publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
