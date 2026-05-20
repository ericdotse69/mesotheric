import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type BadgeVariant = "gold" | "shadow" | "light" | "stone";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, string> = {
  gold: "border-primary/30 bg-primary/10 text-primary",
  shadow: "border-red-500/30 bg-red-500/10 text-red-300",
  light: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  stone: "border-border-soft bg-surface text-muted-text",
};

export function Badge({
  className,
  variant = "stone",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}