import { useState, type FormEvent } from 'react';
import { createCompany, updateOwnCompany, type Company, type CompanyInput } from '@/lib/community';

interface Props {
  company: Company | null;
  onCancel: () => void;
  onSaved: () => void;
}

const FIELD_CLASS =
  'w-full rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-3 py-2 text-sm text-obsidian-100 placeholder:text-obsidian-500 focus:border-neon-green/60 focus:outline-none';

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function CompanyForm({ company, onCancel, onSaved }: Props) {
  const [name, setName] = useState(company?.name ?? '');
  const [description, setDescription] = useState(company?.description ?? '');
  const [websiteUrl, setWebsiteUrl] = useState(company?.website_url ?? '');
  const [logoUrl, setLogoUrl] = useState(company?.logo_url ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Company name is required.');
      return;
    }
    const input: CompanyInput = {
      name: trimmedName,
      slug: slugify(trimmedName),
      description: description.trim(),
      website_url: websiteUrl.trim(),
      logo_url: logoUrl.trim(),
    };
    setSaving(true);
    setError(null);
    if (company) {
      const message = await updateOwnCompany(company.id, input);
      setSaving(false);
      if (message) {
        setError(message);
        return;
      }
    } else {
      const ok = await createCompany(input);
      setSaving(false);
      if (!ok) {
        setError('We could not create this company. Please try again.');
        return;
      }
    }
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-obsidian-700/60 bg-obsidian-900/70 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-xs font-medium text-obsidian-200">
          Company name
          <input className={FIELD_CLASS} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required />
        </label>
        <label className="space-y-1.5 text-xs font-medium text-obsidian-200">
          Website
          <input className={FIELD_CLASS} value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://" maxLength={200} />
        </label>
      </div>
      <label className="block space-y-1.5 text-xs font-medium text-obsidian-200">
        Description
        <textarea className={`${FIELD_CLASS} min-h-[80px] resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
      </label>
      <label className="block space-y-1.5 text-xs font-medium text-obsidian-200">
        Logo URL
        <input className={FIELD_CLASS} value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://" maxLength={300} />
      </label>

      {error && <p role="alert" className="text-xs text-red-300">{error}</p>}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm text-obsidian-300 transition-colors hover:text-obsidian-100">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Saving...' : company ? 'Save changes' : 'Add company'}
        </button>
      </div>
    </form>
  );
}
