import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export function Input({ icon, className, ...props }: InputProps) {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="pointer-events-none absolute left-4 text-primary-400">
          {icon}
        </span>
      )}
      <input
        className={cn(
          "h-11 w-full rounded-pill bg-surface px-4 text-sm text-foreground placeholder:text-primary-400",
          "outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
          icon ? "pl-11" : undefined,
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-2xl bg-surface px-4 py-3 text-sm text-foreground placeholder:text-primary-400",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        className,
      )}
      {...props}
    />
  );
}
