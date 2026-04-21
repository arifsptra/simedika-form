import type { ReactNode } from "react";

interface InputWrapperProps {
  label?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export const InputWrapper = ({
  label,
  required,
  error,
  children,
}: InputWrapperProps) => {
  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="block text-sm font-medium text-slate-700 dark:text-lime-100">
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </label>
      ) : null}

      {children}

      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
};
