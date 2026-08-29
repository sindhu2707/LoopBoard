import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Loopboard</h1>
          <p className="text-sm text-ink-muted mt-2">Developer productivity dashboard</p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-3 rounded-md bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}