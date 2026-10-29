import { useEffect, useState, type FormEvent } from 'react';
import { Building2, Check, Loader2, Users, X } from 'lucide-react';
import { useCommunity } from '@/context/CommunityContext';
import { useToast } from '@/context/ToastContext';
import {
  createCommunityMember,
  createCompany,
  fetchCompanies,
  fetchCommunityMembers,
  type Company,
  type CommunityMember,
} from '@/lib/community';

const inputCls = 'w-full rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-3 py-2 text-sm text-obsidian-100 placeholder:text-obsidian-300 outline-none transition-all focus:border-emerald-500/50';

type Tab = 'members' | 'companies' | 'join' | 'company';

export function CommunityModal() {
  const { isOpen, close } = useCommunity();
  const { notify } = useToast();
  const [tab, setTab] = useState<Tab>('members');
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [memberForm, setMemberForm] = useState({ display_name: '', handle: '', bio: '', role: 'Builder', website_url: '', company_id: '', avatar_initials: '' });
  const [companyForm, setCompanyForm] = useState({ name: '', slug: '', description: '', website_url: '', logo_url: '' });

  const load = async () => {
    setLoading(true);
    const [memberRows, companyRows] = await Promise.all([fetchCommunityMembers(), fetchCompanies()]);
    setMembers(memberRows);
    setCompanies(companyRows);
    setLoading(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    void load();
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const submitMember = async (event: FormEvent) => {
    event.preventDefault();
    if (!memberForm.display_name.trim() || !memberForm.handle.trim() || !memberForm.bio.trim()) { setError('Name, handle, and bio are required.'); return; }
    setSaving(true); setError('');
    const initials = memberForm.avatar_initials.trim() || memberForm.display_name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
    const ok = await createCommunityMember({ ...memberForm, company_id: memberForm.company_id || null, avatar_initials: initials });
    setSaving(false);
    if (!ok) { setError('Could not join right now. Try another handle or try again later.'); return; }
    notify('You are now part of the community directory.');
    setMemberForm({ display_name: '', handle: '', bio: '', role: 'Builder', website_url: '', company_id: '', avatar_initials: '' });
    setTab('members');
    await load();
  };

  const submitCompany = async (event: FormEvent) => {
    event.preventDefault();
    if (!companyForm.name.trim() || !companyForm.description.trim()) { setError('Company name and description are required.'); return; }
    setSaving(true); setError('');
    const ok = await createCompany({ ...companyForm, slug: companyForm.slug.trim() || companyForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') });
    setSaving(false);
    if (!ok) { setError('Could not add this company. The name may already be listed.'); return; }
    notify('Company added to the community directory.');
    setCompanyForm({ name: '', slug: '', description: '', website_url: '', logo_url: '' });
    setTab('companies');
    await load();
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'members', label: `Members ${members.length ? `(${members.length})` : ''}` },
    { key: 'companies', label: `Companies ${companies.length ? `(${companies.length})` : ''}` },
    { key: 'join', label: 'Join as member' },
    { key: 'company', label: 'Add company' },
  ];

  return <div className="fixed inset-0 z-[72] flex items-start justify-center overflow-y-auto bg-obsidian-950/80 px-4 py-8 backdrop-blur-sm sm:py-14" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
    <div className="w-full max-w-3xl animate-slide-down rounded-2xl border border-obsidian-700/70 bg-obsidian-900/95 shadow-card backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-obsidian-700/60 px-5 py-4"><div><h2 className="font-display text-lg font-semibold text-obsidian-100">Community network</h2><p className="mt-0.5 text-xs text-obsidian-300">Meet builders, discover AI companies, and connect your work.</p></div><button type="button" onClick={close} className="grid h-8 w-8 place-items-center rounded-lg text-obsidian-300 hover:bg-obsidian-700/60 hover:text-obsidian-100" aria-label="Close"><X className="h-4 w-4" /></button></div>
      <div className="flex gap-1 overflow-x-auto border-b border-obsidian-700/60 px-5 py-3 no-scrollbar">{tabs.map((item) => <button key={item.key} type="button" onClick={() => { setTab(item.key); setError(''); }} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${tab === item.key ? 'bg-emerald-500/10 text-emerald-400' : 'text-obsidian-300 hover:bg-obsidian-800 hover:text-obsidian-100'}`}>{item.label}</button>)}</div>
      <div className="max-h-[68vh] overflow-y-auto px-5 py-5">
        {loading && <div className="flex items-center justify-center py-12 text-sm text-obsidian-300"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading community…</div>}
        {!loading && tab === 'members' && <div className="grid gap-3 sm:grid-cols-2">{members.length ? members.map((member) => <div key={member.id} className="rounded-xl border border-obsidian-700/60 bg-obsidian-950/40 p-4"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-400">{member.avatar_initials}</span><div className="min-w-0"><p className="font-medium text-obsidian-100">{member.display_name}</p><p className="text-xs text-emerald-400">@{member.handle} · {member.role}</p></div></div><p className="mt-3 text-xs leading-relaxed text-obsidian-300">{member.bio}</p></div>) : <Empty label="No community members yet. Be the first to join." />}</div>}
        {!loading && tab === 'companies' && <div className="grid gap-3 sm:grid-cols-2">{companies.length ? companies.map((company) => <div key={company.id} className="rounded-xl border border-obsidian-700/60 bg-obsidian-950/40 p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-500/10 text-violet-300"><Building2 className="h-5 w-5" /></span><div><p className="font-medium text-obsidian-100">{company.name}</p><p className="text-xs text-obsidian-400">{company.verified ? 'Verified company' : 'Community company'}</p></div></div><p className="mt-3 text-xs leading-relaxed text-obsidian-300">{company.description}</p></div>) : <Empty label="No companies yet. Add yours to the network." />}</div>}
        {!loading && tab === 'join' && <form onSubmit={submitMember} className="space-y-4"><FormField label="Display name" required><input className={inputCls} value={memberForm.display_name} onChange={(e) => setMemberForm({ ...memberForm, display_name: e.target.value })} placeholder="Avery Chen" /></FormField><div className="grid gap-4 sm:grid-cols-2"><FormField label="Handle" required><input className={inputCls} value={memberForm.handle} onChange={(e) => setMemberForm({ ...memberForm, handle: e.target.value.replace(/\s/g, '').toLowerCase() })} placeholder="averybuilds" /></FormField><FormField label="Role"><select className={inputCls} value={memberForm.role} onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}><option>Builder</option><option>Prompt Engineer</option><option>Founder</option><option>Designer</option><option>Researcher</option><option>Developer</option></select></FormField></div><FormField label="Bio" required><textarea className={`${inputCls} min-h-[90px] resize-y`} value={memberForm.bio} onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })} placeholder="What are you building with AI?" /></FormField><div className="grid gap-4 sm:grid-cols-2"><FormField label="Company"><select className={inputCls} value={memberForm.company_id} onChange={(e) => setMemberForm({ ...memberForm, company_id: e.target.value })}><option value="">Independent</option>{companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></FormField><FormField label="Website"><input className={inputCls} value={memberForm.website_url} onChange={(e) => setMemberForm({ ...memberForm, website_url: e.target.value })} placeholder="https://..." /></FormField></div><Submit label="Join the community" saving={saving} /></form>}
        {!loading && tab === 'company' && <form onSubmit={submitCompany} className="space-y-4"><FormField label="Company name" required><input className={inputCls} value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} placeholder="Acme AI" /></FormField><FormField label="Short description" required><textarea className={`${inputCls} min-h-[90px] resize-y`} value={companyForm.description} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })} placeholder="What does your company build?" /></FormField><div className="grid gap-4 sm:grid-cols-2"><FormField label="Website"><input className={inputCls} value={companyForm.website_url} onChange={(e) => setCompanyForm({ ...companyForm, website_url: e.target.value })} placeholder="https://..." /></FormField><FormField label="Logo URL"><input className={inputCls} value={companyForm.logo_url} onChange={(e) => setCompanyForm({ ...companyForm, logo_url: e.target.value })} placeholder="https://.../logo.png" /></FormField></div><Submit label="Add company" saving={saving} /></form>}
        {error && <p className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</p>}
      </div>
    </div>
  </div>;
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <label className="block"><span className="mb-1.5 block text-xs font-medium text-obsidian-100">{label}{required && <span className="text-emerald-400"> *</span>}</span>{children}</label>; }
function Submit({ label, saving }: { label: string; saving: boolean }) { return <button type="submit" disabled={saving} className="btn-primary border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{saving ? 'Saving…' : label}</button>; }
function Empty({ label }: { label: string }) { return <div className="col-span-full rounded-xl border border-dashed border-obsidian-700/60 py-12 text-center text-sm text-obsidian-300"><Users className="mx-auto mb-2 h-5 w-5 text-obsidian-500" />{label}</div>; }
