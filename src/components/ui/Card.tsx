"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, glow = false, header, footer, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl bg-[#0B1224] border border-[#1B2A45] text-[#F8FAFC] transition-all duration-300 overflow-hidden",
          hover &&
            "hover:border-[#00D9FF]/40 hover:shadow-[0_0_20px_rgba(0,217,255,0.08)] hover:-translate-y-0.5",
          glow && "shadow-[0_0_25px_rgba(0,217,255,0.1)] border-[#00D9FF]/30",
          className
        )}
        {...props}
      >
        {header && <CardHeader>{header}</CardHeader>}
        {header || footer ? <CardContent>{children}</CardContent> : children}
        {footer && <CardFooter>{footer}</CardFooter>}
      </div>
    );
  }
);
Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 flex flex-col space-y-1.5 border-b border-[#1B2A45]/60", className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = "h3", className, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn("text-lg font-semibold tracking-tight text-[#F8FAFC]", className)}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-[#94A3B8]", className)}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("p-6", className)} {...props} />;
  }
);
CardContent.displayName = "CardContent";

export const CardBody = CardContent;

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 flex items-center border-t border-[#1B2A45]/60 bg-[#080D1B]/50", className)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";
