import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "hermetic-input min-h-28 w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none transition focus:border-primary",
        className
      )}
      {...props}
    />
  );
}