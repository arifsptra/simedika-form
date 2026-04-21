import type { InputHTMLAttributes } from "react";
import { cn } from "../../../utils/cn";
import { InputWrapper } from "./InputWrapper";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  requiredLabel?: boolean;
  error?: string;
}

export const Input = ({
  label,
  requiredLabel,
  error,
  className,
  ...props
}: InputProps) => {
  return (
    <InputWrapper label={label} required={requiredLabel} error={error}>
      <input
        className={cn(
          "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 dark:border-kdark-border dark:bg-kdark-elevated dark:text-lime-100 dark:placeholder:text-lime-300/45 dark:focus:border-lime-500 dark:focus:ring-lime-900/60",
          className,
        )}
        {...props}
      />
    </InputWrapper>
  );
};
