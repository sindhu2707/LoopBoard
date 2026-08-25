import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_STYLES = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-accent flex items-center justify-center font-medium text-white shrink-0",
        SIZE_STYLES[size],
        className
      )}
      title={name}
    >
      {initials(name)}
    </div>
  );
}

// Overlapping avatar stack — used on project/task cards
export function AvatarStack({ names, max = 3 }: { names: string[]; max?: number }) {
  const visible = names.slice(0, max);
  const overflow = names.length - visible.length;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((name) => (
        <Avatar
          key={name}
          name={name}
          size="sm"
          className="ring-2 ring-surface-raised"
        />
      ))}
      {overflow > 0 && (
        <div className="w-6 h-6 rounded-full bg-surface-border ring-2 ring-surface-raised flex items-center justify-center text-[10px] text-ink-muted">
          +{overflow}
        </div>
      )}
    </div>
  );
}