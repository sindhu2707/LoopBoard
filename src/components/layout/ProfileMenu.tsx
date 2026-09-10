"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Settings, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

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

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2"
        aria-label="User menu"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar name={user.name} size="md" />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 mt-2 w-64 bg-surface-raised border border-surface-border",
            "rounded-card shadow-card py-2 z-50"
          )}
        >
          <div className="px-3 py-3 border-b border-surface-border mb-1 flex items-center gap-3">
            <Avatar name={user.name} size="md" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">{user.name}</p>
              <p className="text-xs text-ink-muted truncate">{user.role}</p>
              <p className="text-xs text-ink-faint truncate">{user.email}</p>
            </div>
          </div>

          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left text-ink-muted hover:bg-surface-border hover:text-ink transition-colors"
          >
            <Settings size={16} />
            Settings
          </Link>

          <div className="border-t border-surface-border mt-1 pt-1">
            <button
              role="menuitem"
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left text-status-danger hover:bg-status-danger/10 transition-colors"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}