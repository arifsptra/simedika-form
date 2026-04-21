import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../../utils/cn";
import { InputWrapper } from "./InputWrapper";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  requiredLabel?: boolean;
  error?: string;
}

export const TextArea = ({
  label,
  requiredLabel,
  error,
  className,
  ...props
}: TextAreaProps) => {
  return (
    <InputWrapper label={label} required={requiredLabel} error={error}>
      <textarea
        className={cn(
          "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 dark:border-kdark-border dark:bg-kdark-elevated dark:text-lime-100 dark:placeholder:text-lime-300/45 dark:focus:border-lime-500 dark:focus:ring-lime-900/60",
          className,
        )}
        {...props}
      />
    </InputWrapper>
  );
};
