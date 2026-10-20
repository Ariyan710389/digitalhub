"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface LoadingSpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: "w-3 h-3 border-[2px]",
  sm: "w-4 h-4 border-[2px]",
  md: "w-6 h-6 border-[2.5px]",
  lg: "w-8 h-8 border-[3px]",
  xl: "w-12 h-12 border-[4px]",
};

export const LoadingSpinner = React.forwardRef<SVGSVGElement, LoadingSpinnerProps>(
  ({ size = "md", className, label = "Loading", ...props }, ref) => {
    return (
      <span
        role="status"
        aria-label={label}
        className="inline-flex items-center justify-center"
      >
        <svg
          ref={ref}
          className={cn(
            "animate-spin rounded-full border-t-transparent",
            sizeClasses[size],
            "border-[#00D9FF]/30 border-t-[#00D9FF]",
            className
          )}
          viewBox="0 0 24 24"
          fill="none"
          {...props}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="sr-only">{label}</span>
      </span>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";
