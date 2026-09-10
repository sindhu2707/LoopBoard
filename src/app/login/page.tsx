"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-surface-raised border border-surface-border rounded-card shadow-card p-6">
        <h1 className="text-xl font-semibold text-ink mb-1">Welcome back</h1>
        <p className="text-sm text-ink-muted mb-6">Log in to your Loopboard account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "w-full bg-surface border border-surface-border rounded-card",
                "px-3 py-2 text-sm text-ink placeholder:text-ink-faint",
                "focus:outline-none focus:ring-2 focus:ring-accent"
              )}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "w-full bg-surface border border-surface-border rounded-card",
                "px-3 py-2 text-sm text-ink placeholder:text-ink-faint",
                "focus:outline-none focus:ring-2 focus:ring-accent"
              )}
            />
          </div>

          {error && <p className="text-sm text-status-danger">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 rounded-md bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-ink-muted mt-4 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}