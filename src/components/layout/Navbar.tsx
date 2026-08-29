"use client";

import { Menu, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileMenu } from "./ProfileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationsDropdown } from "./NotificationsDropdown";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="h-16 border-b border-surface-border bg-surface-raised flex items-center gap-4 px-4 md:px-6">
      <button
        onClick={onMenuClick}
        className="md:hidden text-ink-muted hover:text-ink p-1 -m-1"
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>

      <div className="flex-1 max-w-md relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
        />
        <input
          type="search"
            aria-label="Search projects and tasks"
          placeholder="Search projects, tasks..."
          className={cn(
            "w-full bg-surface border border-surface-border rounded-card",
            "pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-faint",
            "focus:outline-none focus:ring-2 focus:ring-accent"
          )}
        />
      </div>     

      <NotificationsDropdown />

      <ThemeToggle />
        <button className="relative text-ink-muted hover:text-ink" aria-label="Notifications"></button>

      <ProfileMenu />
    </header>
  );
}