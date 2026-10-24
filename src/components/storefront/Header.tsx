"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Phone,
  ShieldAlert,
  GraduationCap,
  Package,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { NAVIGATION_LINKS, APP_CONFIG } from "@/lib/constants";

interface HeaderProps {
  siteSettings?: Record<string, string>;
}

export function Header({ siteSettings }: HeaderProps = {}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toggleCart, getItemCount, getTotal } = useCartStore();

  const fbLink = siteSettings?.social_facebook || APP_CONFIG.social.facebook;
  const igLink = siteSettings?.social_instagram || APP_CONFIG.social.instagram;
  const waLink = siteSettings?.social_whatsapp || APP_CONFIG.social.whatsapp;

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const itemCount = getItemCount();
  const cartTotal = getTotal();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070B16] border-b border-[#1B2A45]/80 backdrop-blur-md">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] p-[1.5px] shadow-[0_0_15px_rgba(0,217,255,0.3)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.jpg"
                alt="DigitalHub Logo"
                className="w-full h-full object-cover rounded-[9px]"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-xl font-bold tracking-tight text-[#F8FAFC]">
                  Digital
                </span>
                <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] via-[#2563FF] to-[#8B3DFF]">
                  Hub
                </span>
              </div>
              <span className="text-[9px] font-semibold tracking-widest text-[#94A3B8] uppercase -mt-1">
                Digital Products & Services
              </span>
            </div>
          </Link>

          {/* Search Bar (Center, Wide) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, services, licenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#080D1B] text-sm text-[#F8FAFC] placeholder:text-[#94A3B8]/60 pl-4 pr-12 py-2.5 rounded-full border border-[#1B2A45] focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] transition-all"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-[#00D9FF] to-[#8B3DFF] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Right Area: Auth, Socials, Cart */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Social Icons (Desktop) */}
            <div className="hidden xl:flex items-center gap-2 border-r border-[#1B2A45] pr-4">
              <a
                href={fbLink}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-[#0B1224] border border-[#1B2A45] flex items-center justify-center text-[#94A3B8] hover:text-[#00D9FF] hover:border-[#00D9FF] transition-colors text-xs font-bold"
                title="Facebook"
              >
                f
              </a>
              <a
                href={igLink}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-[#0B1224] border border-[#1B2A45] flex items-center justify-center text-[#94A3B8] hover:text-[#8B3DFF] hover:border-[#8B3DFF] transition-colors text-xs font-bold"
                title="Instagram"
              >
                in
              </a>
              <a
                href={waLink.startsWith("http") ? waLink : `https://wa.me/${waLink.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-[#0B1224] border border-[#1B2A45] flex items-center justify-center text-[#94A3B8] hover:text-emerald-400 hover:border-emerald-400 transition-colors text-xs font-bold"
                title="WhatsApp"
              >
                wa
              </a>
            </div>

            {/* Auth Buttons */}
            {session?.user ? (
              <div className="flex items-center gap-2">
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold text-amber-400 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#0B1224] border border-[#1B2A45] hover:border-[#00D9FF]/50 text-[#F8FAFC] hover:text-[#00D9FF] transition-all shadow-sm"
                  title="My Purchased Services, Courses & Orders"
                >
                  <GraduationCap className="h-4 w-4 text-[#00D9FF]" />
                  <span className="hidden sm:inline truncate max-w-[120px]">
                    My Services
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-[#101A30]"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-xs font-medium text-[#F8FAFC] hover:text-[#00D9FF] px-2.5 py-1.5 rounded-lg hover:bg-[#101A30] transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#2563FF] text-[#F8FAFC] hover:opacity-90 transition-opacity"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Cart Button Pill (Matching Mockup) */}
            <button
              onClick={toggleCart}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF]/10 to-[#8B3DFF]/10 border border-[#00D9FF]/30 hover:border-[#00D9FF] transition-all group"
            >
              <div className="relative">
                <ShoppingCart className="h-4 w-4 text-[#00D9FF] group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold rounded-full bg-gradient-to-r from-[#00D9FF] to-[#8B3DFF] text-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-[#94A3B8] font-medium leading-none">
                  My Cart
                </span>
                <span className="text-xs font-bold text-[#F8FAFC] leading-none mt-1">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A30]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Row (Desktop) */}
      <div className="hidden md:block bg-[#050812] border-t border-[#1B2A45]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 h-11 text-xs font-medium">
            {NAVIGATION_LINKS.map((item) => {
              if (item.children) {
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className="flex items-center gap-1 px-3 py-2 text-[#94A3B8] hover:text-[#00D9FF] transition-colors rounded-lg"
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="absolute top-full left-0 w-52 py-2 rounded-xl bg-[#0B1224] border border-[#1B2A45] shadow-2xl z-50">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-xs text-[#94A3B8] hover:text-[#00D9FF] hover:bg-[#101A30] transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-[#94A3B8] hover:text-[#00D9FF] transition-colors rounded-lg"
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1B2A45] bg-[#070B16] px-4 py-4 space-y-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080D1B] text-sm text-[#F8FAFC] pl-3 pr-10 py-2 rounded-lg border border-[#1B2A45]"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-[#00D9FF]"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          <nav className="flex flex-col space-y-1">
            {session?.user && (session.user as any).role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-xl font-bold mb-1 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Open Admin Portal</span>
              </Link>
            )}
            {session?.user && (
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#00D9FF] bg-[#00D9FF]/10 border border-[#00D9FF]/30 rounded-xl font-bold mb-2 shadow-[0_0_10px_rgba(0,217,255,0.2)]"
              >
                <GraduationCap className="h-4 w-4" />
                <span>My Services & Orders</span>
              </Link>
            )}
            {NAVIGATION_LINKS.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-[#F8FAFC] hover:text-[#00D9FF] rounded-lg"
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1 border-l border-[#1B2A45] ml-3 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-2 py-1 text-xs text-[#94A3B8] hover:text-[#00D9FF]"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
