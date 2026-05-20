import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "hermetic-input w-full rounded-2xl px-4 py-3 text-sm outline-none transition focus:border-primary",
        className
      )}
      {...props}
    />
  );
}