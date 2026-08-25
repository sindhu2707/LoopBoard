"use client";

import { useEffect, useRef, useState } from "react";
import { Settings, LogOut, User } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { CURRENT_USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2"
        aria-label="User menu"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar name={CURRENT_USER.name} size="md" />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 mt-2 w-56 bg-surface-raised border border-surface-border",
            "rounded-card shadow-card py-2 z-50"
          )}
        >
          <div className="px-3 py-2 border-b border-surface-border mb-1">
            <p className="text-sm font-medium text-ink truncate">{CURRENT_USER.name}</p>
            <p className="text-xs text-ink-muted truncate">{CURRENT_USER.role}</p>
          </div>

          <MenuItem icon={User} label="View profile" />
          <MenuItem icon={Settings} label="Settings" />
          <div className="border-t border-surface-border mt-1 pt-1">
            <MenuItem icon={LogOut} label="Log out" danger />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  danger,
}: {
  icon: typeof User;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      role="menuitem"
      className={cn(
        "flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left transition-colors",
        danger
          ? "text-status-danger hover:bg-status-danger/10"
          : "text-ink-muted hover:bg-surface-border hover:text-ink"
      )}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}