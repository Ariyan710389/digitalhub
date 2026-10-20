"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] text-[#F8FAFC] font-semibold shadow-[0_0_15px_rgba(0,217,255,0.25)] hover:shadow-[0_0_25px_rgba(0,217,255,0.4)] hover:brightness-110 active:scale-[0.98]",
  secondary:
    "bg-[#0B1224] text-[#F8FAFC] border border-[#1B2A45] hover:border-[#00D9FF] hover:text-[#00D9FF] hover:bg-[#101A30] hover:shadow-[0_0_15px_rgba(0,217,255,0.15)] active:scale-[0.98]",
  ghost:
    "bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A30]/60 active:scale-[0.98]",
  danger:
    "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500 hover:text-red-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2.5",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled ? "true" : undefined}
        aria-busy={isLoading ? "true" : undefined}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050812]",
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none shadow-none",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner
            size={size === "lg" ? "md" : "sm"}
            className={variant === "primary" ? "border-white/30 border-t-white" : undefined}
          />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
