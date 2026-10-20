import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
}

export function Skeleton({
  variant = "rectangular",
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[#1B2A45]/50",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 rounded-md my-1",
        variant === "rectangular" && "rounded-xl",
        className
      )}
      {...props}
    />
  );
}
