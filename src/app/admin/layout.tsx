import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Package,
  Layers,
  Settings,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Protected: Only ADMIN or STAFF
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    redirect("/login?callbackUrl=/admin");
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Orders", href: "/admin/orders", icon: <ShoppingCart className="h-4 w-4" /> },
    { name: "Payment Verification", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Products", href: "/admin/products", icon: <Package className="h-4 w-4" /> },
    { name: "Categories", href: "/admin/categories", icon: <Layers className="h-4 w-4" /> },
    { name: "Payment Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#050812] text-[#F8FAFC] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#070B16] border-r border-[#1B2A45] flex flex-col shrink-0">
        {/* Header / Brand */}
        <div className="p-6 border-b border-[#1B2A45] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00D9FF] to-[#8B3DFF] p-[2px]">
              <div className="w-full h-full bg-[#070B16] rounded-[10px] flex items-center justify-center text-cyan-400 font-bold text-xs">
                ▶
              </div>
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-[#F8FAFC]">
                Digital<span className="text-[#00D9FF]">Hub</span>
              </div>
              <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Admin Panel
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 text-xs font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#94A3B8] hover:text-[#00D9FF] hover:bg-[#101A30] transition-colors"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer / Storefront link */}
        <div className="p-4 border-t border-[#1B2A45] space-y-3">
          <div className="px-3 py-2 rounded-xl bg-[#0B1224] border border-[#1B2A45] flex items-center gap-2 text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="font-bold block truncate">{session.user.name}</span>
              <span className="text-[10px] text-[#94A3B8] block">{session.user.role}</span>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#050812]">
        {children}
      </main>
    </div>
  );
}
