import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-sm border border-[#cbe9d9] bg-white/70 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#247758] focus:bg-white",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-sm border border-[#cbe9d9] bg-white/70 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#247758] focus:bg-white",
        className,
      )}
      {...props}
    />
  );
}
