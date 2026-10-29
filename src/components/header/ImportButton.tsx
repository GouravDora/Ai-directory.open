import { Upload } from 'lucide-react';
import { useImportModal } from '@/context/ImportModalContext';

export function ImportButton() {
  const { open } = useImportModal();
  return (
    <button
      type="button"
      onClick={open}
      className="btn-primary border border-obsidian-700/70 bg-obsidian-850/60 text-obsidian-200 hover:border-obsidian-500 hover:text-obsidian-100"
    >
      <Upload className="h-4 w-4" />
      <span className="hidden sm:inline">Import</span>
    </button>
  );
}
