import { Plus } from 'lucide-react';
import { useSubmissionModal } from '@/context/SubmissionModalContext';

export function SubmitButton() {
  const { open } = useSubmissionModal();
  return (
    <button
      type="button"
      onClick={open}
      className="btn-primary border border-emerald-500/30 bg-emerald-500/10 px-2.5 text-emerald-400 hover:bg-emerald-500/20 sm:px-4"
      aria-label="Submit asset"
      title="Submit asset"
    >
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">Submit asset</span>
    </button>
  );
}
