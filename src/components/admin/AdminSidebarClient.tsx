"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  ExternalLink,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  CreditCard,
  Settings,
  LogOut,
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
    if (!name) return "DH";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="w-full md:w-64 bg-[#070B16] border-r border-[#1B2A45] flex flex-col shrink-0 min-h-screen text-[#F8FAFC]">
      {/* 1. Brand Header */}
      <div className="p-5 pb-4">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] p-[1.5px] shadow-[0_0_15px_rgba(0,217,255,0.35)] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.jpg"
              alt="DigitalHub Logo"
              className="w-full h-full object-cover rounded-[9px]"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-[#F8FAFC]">
              Digital<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#8B3DFF]">Hub</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#00D9FF]">
              ADMIN PORTAL
            </span>
          </div>
        </Link>

        {/* 2. View Live Store Pill Button */}
        <div className="mt-5">
          <Link
            href="/"
            target="_blank"
            className="w-full px-3.5 py-2 rounded-xl bg-[#0B1224] border border-[#1B2A45] hover:border-[#00D9FF]/60 hover:bg-[#101A30] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse shadow-[0_0_8px_#00D9FF]" />
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
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]/60">
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
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] text-[#050812] font-black shadow-[0_0_20px_rgba(0,217,255,0.35)]"
                  : "text-[#94A3B8] hover:text-[#00D9FF] hover:bg-[#101A30]"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "transition-colors",
                    isActive ? "text-[#050812]" : "text-[#94A3B8] group-hover:text-[#00D9FF]"
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
                      ? "bg-[#050812] text-[#00D9FF]"
                      : "bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30"
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
      <div className="p-4 border-t border-[#1B2A45] bg-[#070B16]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar Circle with initials */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] flex items-center justify-center text-[#050812] text-xs font-black shrink-0 shadow-[0_0_10px_rgba(0,217,255,0.3)]">
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
            className="p-2 rounded-xl text-[#94A3B8] hover:text-rose-400 hover:bg-[#101A30] transition-colors shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
