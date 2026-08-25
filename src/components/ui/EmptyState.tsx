import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="w-12 h-12 rounded-full bg-surface-border flex items-center justify-center mb-4">
        <Icon size={22} className="text-ink-muted" />
      </div>
      <h3 className="text-sm font-medium text-ink mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-ink-muted max-w-xs mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}