import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = ({ hover, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200/80 bg-white shadow-[0_16px_45px_-20px_rgba(15,23,42,0.15)] dark:border-kdark-border-subtle dark:bg-kdark-surface dark:shadow-[0_20px_45px_-22px_rgba(0,0,0,0.6)]",
        hover &&
          "transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-20px_rgba(15,23,42,0.45)]",
        className,
      )}
      {...props}
    />
  );
};
