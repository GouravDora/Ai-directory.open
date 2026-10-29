import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X, Loader2, Send, Check, Info } from 'lucide-react';
import { useSubmissionModal } from '@/context/SubmissionModalContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { createSubmission, ICON_REGISTRY } from '@/lib/submissions';
import { CATEGORY_FILTERS, type AssetCategory } from '@/data/integrations';

const ICON_CHOICES = [
  'Sparkles', 'Zap', 'Wind', 'Bot', 'Hexagon', 'Headphones', 'ShoppingCart',
  'MousePointerClick', 'Terminal', 'FileCode', 'Cable', 'Code', 'Code2',
  'Brain', 'Cpu', 'MessageSquare', 'Boxes', 'Plug', 'Webhook', 'Server',
  'Cloud', 'GitBranch', 'Rocket', 'Wand2', 'Layers', 'Command', 'Globe',
  'Network', 'Workflow', 'SquareTerminal',
];

const ACCENTS: { value: 'green' | 'purple'; label: string }[] = [
  { value: 'green', label: 'Neon Green' },
  { value: 'purple', label: 'Neon Purple' },
];

const EMPTY = {
  name: '',
  tagline: '',
  description: '',
  category: 'IDE' as AssetCategory,
  accent: 'green' as 'green' | 'purple',
  icon_name: 'Sparkles',
  system_prompt: '',
  framework_rules: '',
  mcp_connection_string: '',
  is_open_source: false,
};

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-xs font-medium text-obsidian-100">
        {label}
        {required && <span className="text-emerald-400">*</span>}
      </span>
      {children}
      {hint && (
        <span className="mt-1 flex items-center gap-1 text-[11px] text-obsidian-300">
          <Info className="h-3 w-3" /> {hint}
        </span>
      )}
    </label>
  );
}

const inputCls =
  'w-full rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-3 py-2 text-sm text-obsidian-100 placeholder:text-obsidian-300 outline-none transition-all focus:border-emerald-500/50 focus:bg-obsidian-900/60';

export function SubmissionModal({ onSubmitted }: { onSubmitted: () => void }) {
  const { isOpen, close } = useSubmissionModal();
  const { notify } = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.tagline.trim()) e.tagline = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.system_prompt.trim()) e.system_prompt = 'Required';
    if (!form.mcp_connection_string.trim()) e.mcp_connection_string = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const ok = await createSubmission({
      ...form,
      submitted_by: user?.name ?? 'Anonymous',
    });
    setSubmitting(false);
    if (ok) {
      notify('Submission published — it is now live on the board!');
      setForm(EMPTY);
      close();
      onSubmitted();
    } else {
      notify('Could not publish — running in local mode.', 'error');
    }
  };

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

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
              Publish an asset
            </h2>
            <p className="mt-0.5 text-xs text-obsidian-300">
              Share your AI rule, MCP server, or prompt with the community.
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Asset name" required hint="e.g. Cursor, My MCP Server">
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="My Custom MCP"
              />
              {errors.name && <span className="text-[11px] text-rose-400">{errors.name}</span>}
            </Field>
            <Field label="Tagline" required hint="One short marketing line">
              <input
                className={inputCls}
                value={form.tagline}
                onChange={(e) => set('tagline', e.target.value)}
                placeholder="The fastest way to ship prompts"
              />
              {errors.tagline && <span className="text-[11px] text-rose-400">{errors.tagline}</span>}
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Description" required>
              <textarea
                className={`${inputCls} min-h-[72px] resize-y`}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Describe what this asset does and who it's for."
              />
              {errors.description && (
                <span className="text-[11px] text-rose-400">{errors.description}</span>
              )}
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Source type" required hint="Open source assets appear on the green tab; closed source on the gray tab.">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => set('is_open_source', true)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    form.is_open_source
                      ? 'border-neon-green/50 bg-neon-green/10 text-neon-green'
                      : 'border-obsidian-700/60 bg-obsidian-850/60 text-obsidian-200 hover:border-obsidian-500'
                  }`}
                >
                  Open Source
                </button>
                <button
                  type="button"
                  onClick={() => set('is_open_source', false)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    !form.is_open_source
                      ? 'border-obsidian-500 bg-obsidian-800 text-obsidian-200'
                      : 'border-obsidian-700/60 bg-obsidian-850/60 text-obsidian-200 hover:border-obsidian-500'
                  }`}
                >
                  Closed Source
                </button>
              </div>
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Category" required>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => set('category', e.target.value as AssetCategory)}
              >
                {CATEGORY_FILTERS.filter((c) => c.value !== 'All').map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Accent">
              <div className="flex gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => set('accent', a.value)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      form.accent === a.value
                        ? a.value === 'green'
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                          : 'border-violet-500/40 bg-violet-500/10 text-violet-400'
                        : 'border-obsidian-700/60 bg-obsidian-850/60 text-obsidian-200 hover:border-obsidian-500'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Icon" hint="Pick a Lucide icon for the card">
              <div className="grid max-h-28 grid-cols-8 gap-1.5 overflow-y-auto rounded-lg border border-obsidian-700/60 bg-obsidian-950/60 p-2 sm:grid-cols-10">
                {ICON_CHOICES.map((name) => {
                  const Icon = ICON_REGISTRY[name];
                  const selected = form.icon_name === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={() => set('icon_name', name)}
                      className={`grid h-8 w-8 place-items-center rounded-md transition-all ${
                        selected
                          ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40'
                          : 'text-obsidian-200 hover:bg-obsidian-700/60'
                      }`}
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          <div className="mt-5 space-y-4 border-t border-obsidian-700/60 pt-5">
            <Field label="System Prompt" required hint="The tab content shown under System Prompt">
              <textarea
                className={`${inputCls} min-h-[110px] resize-y font-mono text-xs`}
                value={form.system_prompt}
                onChange={(e) => set('system_prompt', e.target.value)}
                placeholder="You are a senior assistant…"
              />
              {errors.system_prompt && (
                <span className="text-[11px] text-rose-400">{errors.system_prompt}</span>
              )}
            </Field>

            <Field label="Framework Rules" hint="One rule per line (optional)">
              <textarea
                className={`${inputCls} min-h-[80px] resize-y font-mono text-xs`}
                value={form.framework_rules}
                onChange={(e) => set('framework_rules', e.target.value)}
                placeholder={'Always run the type-checker.\nNever drop columns.'}
              />
            </Field>

            <Field label="MCP Connection String" required>
              <input
                className={`${inputCls} font-mono text-xs`}
                value={form.mcp_connection_string}
                onChange={(e) => set('mcp_connection_string', e.target.value)}
                placeholder="mytool://mcp?transport=stdio&command=mytool-mcp"
              />
              {errors.mcp_connection_string && (
                <span className="text-[11px] text-rose-400">{errors.mcp_connection_string}</span>
              )}
            </Field>
          </div>

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
              disabled={submitting}
              className="btn-primary border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {submitting ? 'Publishing…' : 'Publish asset'}
            </button>
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-obsidian-300">
            <Check className="h-3 w-3 text-emerald-400" />
            Your submission will appear instantly on the directory board.
          </p>
        </form>
      </div>
    </div>
  );
}
