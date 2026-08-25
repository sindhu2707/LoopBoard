import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  asButton?: boolean;
}

export function Card({ className, hoverable, asButton, ...props }: CardProps) {
  const Component = asButton ? "button" : "div";
  return (
    <Component
      className={cn(
        "bg-surface-raised border border-surface-border rounded-card shadow-card p-4 text-left w-full",
        hoverable && "transition-colors hover:border-accent/50 cursor-pointer focus-visible:border-accent",
        className
      )}
      {...(props as any)}
    />
  );
}