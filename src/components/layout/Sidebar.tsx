"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Projects", icon: FolderKanban, href: "/projects" },
  { label: "Tasks", icon: CheckSquare, href: "/tasks" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed z-50 inset-y-0 left-0 w-64 bg-surface-raised border-r border-surface-border",
          "flex flex-col transition-transform duration-200 ease-in-out",
          "md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Primary navigation"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-surface-border">
          <span className="font-semibold text-ink">DevBoard</span>
          <button
            onClick={onClose}
            className="md:hidden text-ink-muted hover:text-ink p-1 -m-1"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-card text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent-muted text-accent"
                    : "text-ink-muted hover:bg-surface-border hover:text-ink"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}