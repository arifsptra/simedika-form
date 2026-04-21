import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-lime-500 text-white hover:bg-lime-600 shadow-sm dark:bg-lime-500 dark:text-kdark-bg dark:hover:bg-lime-400",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-kdark-elevated dark:text-lime-100 dark:hover:bg-kdark-border",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-lime-100 dark:hover:bg-kdark-elevated",
};

const sizes: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2 rounded-xl",
  lg: "text-base px-5 py-3 rounded-xl",
};

export const Button = ({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {leftIcon ? <span className="inline-flex">{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className="inline-flex">{rightIcon}</span> : null}
    </button>
  );
};
