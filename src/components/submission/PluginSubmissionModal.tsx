import { useEffect, useState, type FormEvent } from 'react';
import { X, Loader2, Plug, Check, Info } from 'lucide-react';
import { usePluginSubmission } from '@/context/PluginSubmissionContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { createPlugin } from '@/lib/plugins';
import { isHttpUrl } from '@/lib/assets';
import { fetchCompanies, type Company } from '@/lib/community';

const inputCls = 'w-full rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-3 py-2 text-sm text-obsidian-100 placeholder:text-obsidian-300 outline-none transition-all focus:border-emerald-500/50';
const EMPTY = {
  name: '', slug: '', tagline: '', description: '', plugin_type: 'AI Plugin', icon_name: 'Plug',
  system_prompt: '', framework_rules: '', mcp_connection_string: '', install_command: '',
  repository_url: '', website_url: '', company_id: null as string | null, is_open_source: false, logo_url: '',
};

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 flex items-center gap-1 text-xs font-medium text-obsidian-100">{label}{required && <span className="text-emerald-400">*</span>}</span>{children}{hint && <span className="mt-1 flex items-center gap-1 text-[11px] text-obsidian-300"><Info className="h-3 w-3" />{hint}</span>}</label>;
}

export function PluginSubmissionModal({ onSubmitted }: { onSubmitted: () => void }) {
  const { isOpen, close } = usePluginSubmission();
  const { user } = useAuth();
  const { notify } = useToast();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    fetchCompanies().then(setCompanies);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isOpen, close]);

  if (!isOpen) return null;
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.tagline.trim() || !form.description.trim() || !form.install_command.trim()) {
      setError('Name, tagline, description, and install command are required.');
      return;
    }
    if (form.logo_url.trim() && !isHttpUrl(form.logo_url.trim())) {
      setError('Logo Image URL must be a valid http(s) link.');
      return;
    }
    setSubmitting(true);
    setError('');
    const ok = await createPlugin({ ...form, slug: form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), submitted_by: user?.username ?? user?.name ?? 'Community', logo_url: form.logo_url.trim() });
    setSubmitting(false);
    if (!ok) { setError('Could not publish this plugin right now. Please try again.'); return; }
    notify('Plugin published — it is now live in the directory!');
    setForm(EMPTY);
    close();
    onSubmitted();
  };

  return <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-obsidian-950/80 px-4 py-8 backdrop-blur-sm sm:py-16" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
    <div className="w-full max-w-2xl animate-slide-down rounded-2xl border border-obsidian-700/70 bg-obsidian-900/95 shadow-card backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-obsidian-700/60 px-5 py-4"><div><h2 className="font-display text-lg font-semibold text-obsidian-100">Submit a plugin</h2><p className="mt-0.5 text-xs text-obsidian-300">Share a useful AI plugin, integration, or developer tool.</p></div><button type="button" onClick={close} className="grid h-8 w-8 place-items-center rounded-lg text-obsidian-300 hover:bg-obsidian-700/60 hover:text-obsidian-100" aria-label="Close"><X className="h-4 w-4" /></button></div>
      <form onSubmit={submit} className="max-h-[78vh] space-y-4 overflow-y-auto px-5 py-5">
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Plugin name" required><input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="GitHub Release Notes" /></Field><Field label="Plugin type" hint="What does it connect or improve?"><select className={inputCls} value={form.plugin_type} onChange={(e) => set('plugin_type', e.target.value)}><option>AI Plugin</option><option>MCP Integration</option><option>Framework Extension</option><option>Developer Tool</option><option>Prompt Pack</option></select></Field></div>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Tagline" required><input className={inputCls} value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="Turn issues into release notes" /></Field><Field label="Slug" hint="Optional URL-friendly identifier"><input className={inputCls} value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="github-release-notes" /></Field></div>
        <Field label="Description" required><textarea className={`${inputCls} min-h-[72px] resize-y`} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Explain who this plugin helps and what it does." /></Field>
        <Field label="Source type"><div className="flex gap-2"><button type="button" onClick={() => set('is_open_source', true)} className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold ${form.is_open_source ? 'border-neon-green/50 bg-neon-green/10 text-neon-green' : 'border-obsidian-700/60 text-obsidian-200'}`}>Open Source</button><button type="button" onClick={() => set('is_open_source', false)} className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold ${!form.is_open_source ? 'border-obsidian-500 bg-obsidian-800 text-obsidian-200' : 'border-obsidian-700/60 text-obsidian-200'}`}>Closed Source</button></div></Field>
        <Field label="Logo Image URL" hint="Optional custom logo. Falls back to the default plugin icon if empty."><input className={inputCls} value={form.logo_url} onChange={(e) => set('logo_url', e.target.value)} placeholder="https://example.com/logo.png" /></Field>
        <Field label="Install command" required hint="The command developers copy to install it"><input className={`${inputCls} font-mono text-xs`} value={form.install_command} onChange={(e) => set('install_command', e.target.value)} placeholder="npx -y @your-org/your-plugin" /></Field>
        <div className="grid gap-4 sm:grid-cols-3"><Field label="Repository URL"><input className={inputCls} value={form.repository_url} onChange={(e) => set('repository_url', e.target.value)} placeholder="https://github.com/..." /></Field><Field label="Website URL"><input className={inputCls} value={form.website_url} onChange={(e) => set('website_url', e.target.value)} placeholder="https://yourplugin.dev" /></Field><Field label="Company"><select className={inputCls} value={form.company_id ?? ''} onChange={(e) => set('company_id', e.target.value || null)}><option value="">Independent</option>{companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></Field></div>
        <div className="border-t border-obsidian-700/60 pt-4"><Field label="System prompt" hint="Optional prompt the plugin uses"><textarea className={`${inputCls} min-h-[90px] resize-y font-mono text-xs`} value={form.system_prompt} onChange={(e) => set('system_prompt', e.target.value)} placeholder="You are a focused plugin assistant..." /></Field></div>
        <Field label="Framework rules" hint="One rule per line"><textarea className={`${inputCls} min-h-[70px] resize-y font-mono text-xs`} value={form.framework_rules} onChange={(e) => set('framework_rules', e.target.value)} placeholder={'Respect the project conventions.\nAsk before destructive actions.'} /></Field>
        <Field label="MCP connection string" hint="Optional MCP configuration"><input className={`${inputCls} font-mono text-xs`} value={form.mcp_connection_string} onChange={(e) => set('mcp_connection_string', e.target.value)} placeholder="plugin://mcp?transport=stdio&command=..." /></Field>
        {error && <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</p>}
        <div className="flex items-center justify-end gap-2 border-t border-obsidian-700/60 pt-4"><button type="button" onClick={close} className="btn-primary border border-obsidian-700/70 bg-obsidian-850/60 text-obsidian-200">Cancel</button><button type="submit" disabled={submitting} className="btn-primary border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 disabled:opacity-60">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plug className="h-4 w-4" />}{submitting ? 'Publishing…' : 'Publish plugin'}</button></div>
        <p className="flex items-center gap-1.5 text-[11px] text-obsidian-300"><Check className="h-3 w-3 text-emerald-400" />Your plugin becomes discoverable by the AI builder community.</p>
      </form>
    </div>
  </div>;
}
