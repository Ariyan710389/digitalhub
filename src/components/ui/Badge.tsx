"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "gradient";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[#101A30] text-[#94A3B8] border border-[#1B2A45]",
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
  danger: "bg-red-500/10 text-red-400 border border-red-500/30",
  info: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  gradient:
    "bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] text-white font-medium shadow-[0_0_10px_rgba(0,217,255,0.2)] border-0",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[#94A3B8]",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  info: "bg-blue-400",
  gradient: "bg-white",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[11px] px-2 py-0.5 leading-none",
  md: "text-xs px-2.5 py-1 leading-normal",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      dot = false,
      pulse = false,
      icon,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-full select-none gap-1.5 transition-colors",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              dotColors[variant],
              pulse && "animate-ping"
            )}
            aria-hidden="true"
          />
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = "Badge";
