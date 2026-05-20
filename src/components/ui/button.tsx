import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-110 shadow-sm",
  secondary:
    "border border-border-soft bg-surface-elevated text-foreground hover:bg-background",
  ghost:
    "text-muted-text hover:bg-surface-elevated hover:text-foreground",
  danger:
    "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}