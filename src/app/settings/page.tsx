import { EmptyState } from "@/components/ui/EmptyState";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold text-ink mb-6">Settings</h1>
      <EmptyState
        icon={Settings}
        title="Settings coming soon"
        description="Account and workspace preferences will live here."
      />
    </div>
  );
}