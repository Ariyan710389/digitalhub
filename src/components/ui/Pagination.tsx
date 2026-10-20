"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      (i === currentPage - 2 && i > 1) ||
      (i === currentPage + 2 && i < totalPages)
    ) {
      pages.push("...");
    }
  }

  // Remove consecutive duplicates of "..."
  const dedupedPages = pages.filter(
    (page, index) => page !== "..." || pages[index - 1] !== "..."
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-xl bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#00D9FF] hover:border-[#00D9FF]/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {dedupedPages.map((page, idx) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="px-3 py-1.5 text-xs text-[#94A3B8] select-none"
            >
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;
        return (
          <button
            key={`page-${page}`}
            type="button"
            onClick={() => onPageChange(page as number)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
              isCurrent
                ? "bg-gradient-to-r from-[#00D9FF] to-[#2563FF] text-[#050812] font-bold shadow-[0_0_12px_rgba(0,217,255,0.4)]"
                : "bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#1B2A45]/80"
            )}
            aria-current={isCurrent ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-xl bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#00D9FF] hover:border-[#00D9FF]/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
