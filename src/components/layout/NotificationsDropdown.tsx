"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { NotificationItem } from "@/types";
import { fetchNotifications, markNotificationRead } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function formatRelativeTime(iso: string) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && items === null) {
      fetchNotifications().then(setItems);
    }
  }, [open, items]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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

  const unreadCount = items?.filter((n) => !n.read).length ?? 0;

  async function handleMarkRead(id: string) {
    setItems((prev) => prev?.map((n) => (n.id === id ? { ...n, read: true } : n)) ?? null);
    markNotificationRead(id).catch(() => {});
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-raised cursor-pointer transition-colors"
      >
        <Bell className="w-5 h-5 text-ink-muted" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-status-danger" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-surface-raised border border-surface-border rounded-card shadow-card z-50">
          <div className="px-4 py-3 border-b border-surface-border">
            <h3 className="text-sm font-semibold text-ink">Notifications</h3>
          </div>
          {items === null ? (
            <div className="p-4 text-sm text-ink-muted">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-4 text-sm text-ink-muted">No notifications</div>
          ) : (
            <ul>
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleMarkRead(n.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b border-surface-border last:border-0 hover:bg-surface transition-colors cursor-pointer",
                      !n.read && "bg-accent/5"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-accent shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ink font-medium">{n.title}</p>
                        <p className="text-xs text-ink-muted mt-0.5">{n.description}</p>
                        <p className="text-xs text-ink-faint mt-1">{formatRelativeTime(n.timestamp)}</p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}