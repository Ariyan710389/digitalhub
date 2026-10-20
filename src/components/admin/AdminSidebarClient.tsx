"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Sparkles,
  ExternalLink,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  CreditCard,
  Settings,
  LogOut,
  Users,
  Image as ImageIcon,
  BarChart3,
  Ticket,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
  orderCount?: number;
}

export function AdminSidebarClient({ user, orderCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-4 h-4" />,
      exact: true,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: orderCount > 0 ? orderCount : undefined,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: <Package className="w-4 h-4" />,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: <Layers className="w-4 h-4" />,
    },
    {
      name: "Payment Verification",
      href: "/admin/payments",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      name: "Store Settings",
      href: "/admin/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  // Get initials for user avatar
  const getInitials = (name?: string | null) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="w-full md:w-64 bg-[#0A0D18] border-r border-[#1B2438] flex flex-col shrink-0 min-h-screen text-[#F8FAFC]">
      {/* 1. Brand Header */}
      <div className="p-5 pb-4">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#BE123C] via-[#E11D48] to-[#D946EF] p-0.5 shadow-[0_0_15px_rgba(225,29,72,0.4)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-[#F8FAFC]">
              DigitalHub
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B]">
              ADMIN PORTAL
            </span>
          </div>
        </Link>

        {/* 2. View Live Store Pill Button */}
        <div className="mt-5">
          <Link
            href="/"
            target="_blank"
            className="w-full px-3.5 py-2 rounded-xl bg-[#111625] border border-[#1E293B] hover:border-[#00D9FF]/50 text-xs font-semibold text-[#CBD5E1] flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
              <span className="group-hover:text-white transition-colors">
                View Live Store
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#00D9FF] transition-colors" />
          </Link>
        </div>
      </div>

      {/* 3. Section Label: MANAGEMENT */}
      <div className="px-5 pt-3 pb-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">
          MANAGEMENT
        </span>
      </div>

      {/* 4. Menu Items */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-[#BE123C] via-[#E11D48] to-[#BE123C] text-white font-bold shadow-[0_0_20px_rgba(225,29,72,0.4)]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111625]"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "transition-colors",
                    isActive ? "text-white" : "text-[#94A3B8] group-hover:text-[#F8FAFC]"
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-black",
                    isActive
                      ? "bg-white text-[#BE123C]"
                      : "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 5. Bottom Admin User Profile Bar */}
      <div className="p-4 border-t border-[#1B2438] bg-[#0A0D18]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar Circle with initials */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#BE123C] to-[#E11D48] flex items-center justify-center text-white text-xs font-black shrink-0 shadow-md">
              {getInitials(user?.name)}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-[#F8FAFC] block truncate leading-tight">
                {user?.name || "Admin"}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                  Super Admin
                </span>
              </div>
            </div>
          </div>

          {/* Logout Action */}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-rose-400 hover:bg-[#111625] transition-colors shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
