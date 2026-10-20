import React from "react";
import Link from "next/link";
import {
  Bot,
  Layers,
  Megaphone,
  Code,
  GraduationCap,
  Settings,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { CategoryData } from "@/types";

interface CategorySectionProps {
  categories: CategoryData[];
}

const iconMap: Record<string, React.ReactNode> = {
  Bot: <Bot className="h-6 w-6 text-[#00D9FF]" />,
  Layers: <Layers className="h-6 w-6 text-[#8B3DFF]" />,
  Megaphone: <Megaphone className="h-6 w-6 text-[#2563FF]" />,
  Code: <Code className="h-6 w-6 text-emerald-400" />,
  GraduationCap: <GraduationCap className="h-6 w-6 text-amber-400" />,
  Settings: <Settings className="h-6 w-6 text-sky-400" />,
  FileText: <FileText className="h-6 w-6 text-rose-400" />,
};

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="py-14 bg-[#050812] border-b border-[#1B2A45]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Shop by Category
            </h2>
            <div className="w-12 h-[2px] bg-gradient-to-r from-[#00D9FF] to-transparent rounded-full hidden sm:block" />
          </div>

          <Link
            href="/categories"
            className="group flex items-center gap-1.5 text-xs font-semibold text-[#00D9FF] hover:text-white transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4">
          {categories.map((cat) => {
            const icon = (cat.icon && iconMap[cat.icon]) || <Sparkles className="h-6 w-6 text-[#00D9FF]" />;

            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative flex flex-col items-center text-center p-4 rounded-xl bg-[#0B1224] border border-[#1B2A45] hover:border-[#00D9FF]/50 hover:shadow-[0_0_20px_rgba(0,217,255,0.15)] hover:-translate-y-1 transition-all duration-200"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-[#101A30] border border-[#1B2A45] group-hover:border-[#00D9FF]/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner">
                  {icon}
                </div>

                {/* Name */}
                <h3 className="text-xs sm:text-sm font-semibold text-[#F8FAFC] group-hover:text-[#00D9FF] transition-colors leading-snug">
                  {cat.name}
                </h3>

                {/* Description */}
                <p className="text-[11px] text-[#94A3B8] mt-1 line-clamp-1">
                  {cat.description || "Browse catalog"}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
