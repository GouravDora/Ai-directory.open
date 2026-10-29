import { useCallback, useEffect, useState } from 'react';
import { Building2, ExternalLink, Pencil, Plus } from 'lucide-react';
import { fetchCompaniesByOwner, type Company } from '@/lib/community';
import { CompanyForm } from './CompanyForm';

interface Props {
  ownerId: string;
  isOwner: boolean;
}

type FormState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; company: Company };

export function ProfileCompanies({ ownerId, isOwner }: Props) {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [form, setForm] = useState<FormState>({ mode: 'closed' });

  const load = useCallback(async () => {
    setCompanies(await fetchCompaniesByOwner(ownerId));
  }, [ownerId]);

  useEffect(() => {
    let active = true;
    fetchCompaniesByOwner(ownerId).then((rows) => {
      if (active) setCompanies(rows);
    });
    return () => {
      active = false;
    };
  }, [ownerId]);

  const handleSaved = () => {
    setForm({ mode: 'closed' });
    void load();
  };

  if (companies === null) {
    return <p className="text-sm text-obsidian-300">Loading companies...</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-obsidian-300">
          {companies.length === 0 ? 'No companies linked yet.' : `${companies.length} compan${companies.length === 1 ? 'y' : 'ies'}`}
        </p>
        {isOwner && form.mode === 'closed' && (
          <button type="button" onClick={() => setForm({ mode: 'create' })} className="btn-primary">
            <Plus className="h-4 w-4" />
            Add company
          </button>
        )}
      </div>

      {isOwner && form.mode !== 'closed' && (
        <CompanyForm
          company={form.mode === 'edit' ? form.company : null}
          onCancel={() => setForm({ mode: 'closed' })}
          onSaved={handleSaved}
        />
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {companies.map((company) => (
          <li key={company.id} className="flex items-start gap-4 rounded-xl border border-obsidian-700/60 bg-obsidian-900/60 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-obsidian-800 text-amber-300">
              <Building2 className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-obsidian-100">{company.name}</p>
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-obsidian-300">{company.description || 'No description yet.'}</p>
              {company.website_url && (
                <a
                  href={company.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-neon-green hover:underline"
                >
                  Website <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            {isOwner && (
              <button
                type="button"
                onClick={() => setForm({ mode: 'edit', company })}
                aria-label={`Edit ${company.name}`}
                className="rounded-lg p-2 text-obsidian-300 transition-colors hover:bg-obsidian-800 hover:text-obsidian-100"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
