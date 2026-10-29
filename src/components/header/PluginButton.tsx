import { Plug } from 'lucide-react';
import { usePluginSubmission } from '@/context/PluginSubmissionContext';

export function PluginButton() {
  const { open } = usePluginSubmission();
  return (
    <button
      type="button"
      onClick={open}
      className="btn-primary border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20"
    >
      <Plug className="h-4 w-4" />
      <span className="hidden lg:inline">Submit plugin</span>
      <span className="lg:hidden">Plugin</span>
    </button>
  );
}
