import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

interface PaymentMethodItem {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  merchantNumber?: string | null;
  accountType?: string | null;
  isActive: boolean;
}

interface FooterProps {
  siteSettings?: Record<string, string>;
  paymentMethods?: PaymentMethodItem[];
}

export function Footer({ siteSettings, paymentMethods }: FooterProps) {
  const phone = siteSettings?.contact_phone || APP_CONFIG.contact.phone;
  const email = siteSettings?.contact_email || APP_CONFIG.contact.email;
  const address = siteSettings?.business_address || APP_CONFIG.contact.address;
  const supportHours = siteSettings?.support_hours || APP_CONFIG.contact.supportHours;

  const fbLink = siteSettings?.social_facebook || APP_CONFIG.social.facebook;
  const igLink = siteSettings?.social_instagram || APP_CONFIG.social.instagram;
  const ytLink = siteSettings?.social_youtube || APP_CONFIG.social.youtube;
  const waLink = siteSettings?.social_whatsapp || APP_CONFIG.social.whatsapp;
  const tgLink = siteSettings?.social_telegram || APP_CONFIG.social.telegram;

  // Filter payment methods for display (exclude COD if needed, or show active MFS)
  const mfsMethods = paymentMethods && paymentMethods.length > 0
    ? paymentMethods.filter((pm) => pm.slug !== "cod")
    : [
        { slug: "bkash", displayName: "bKash", merchantNumber: "01712345678" },
        { slug: "nagad", displayName: "Nagad", merchantNumber: "01712345678" },
        { slug: "rocket", displayName: "Rocket", merchantNumber: "01712345678" },
      ];

  const getMfsColor = (slug: string) => {
    switch (slug) {
      case "bkash":
        return "text-pink-400";
      case "nagad":
        return "text-orange-400";
      case "rocket":
        return "text-purple-400";
      default:
        return "text-[#00D9FF]";
    }
  };

  return (
    <footer className="w-full bg-[#070B16] border-t border-[#1B2A45] text-[#94A3B8] text-xs">
      {/* Top Gradient Accent Line */}
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#00D9FF] via-[#2563FF] via-[#8B3DFF] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-tr from-[#00D9FF] via-[#2563FF] to-[#8B3DFF] p-[1.5px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.jpg"
                  alt="DigitalHub Logo"
                  className="w-full h-full object-cover rounded-[8px]"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-[#F8FAFC]">
                  Digital<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#8B3DFF]">Hub</span>
                </span>
                <span className="text-[8px] font-semibold tracking-widest text-[#94A3B8] uppercase -mt-0.5">
                  Digital Products & Services
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm">
              Your trusted partner for all digital needs. We provide premium digital products
              and professional services to help you grow faster in the digital world.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={fbLink}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#0B1224] border border-[#1B2A45] flex items-center justify-center text-[#94A3B8] hover:text-[#00D9FF] hover:border-[#00D9FF] transition-all font-bold text-xs"
                title="Facebook"
              >
                f
              </a>
              <a
                href={igLink}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#0B1224] border border-[#1B2A45] flex items-center justify-center text-[#94A3B8] hover:text-[#8B3DFF] hover:border-[#8B3DFF] transition-all font-bold text-xs"
                title="Instagram"
              >
                in
              </a>
              <a
                href={ytLink}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#0B1224] border border-[#1B2A45] flex items-center justify-center text-[#94A3B8] hover:text-red-500 hover:border-red-500 transition-all font-bold text-xs"
                title="YouTube"
              >
                yt
              </a>
              <a
                href={waLink.startsWith("http") ? waLink : `https://wa.me/${waLink.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#0B1224] border border-[#1B2A45] flex items-center justify-center text-[#94A3B8] hover:text-emerald-400 hover:border-emerald-400 transition-all font-bold text-xs"
                title="WhatsApp"
              >
                wa
              </a>
              <a
                href={tgLink.startsWith("http") ? tgLink : `https://t.me/${tgLink.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#0B1224] border border-[#1B2A45] flex items-center justify-center text-[#94A3B8] hover:text-sky-400 hover:border-sky-400 transition-all font-bold text-xs"
                title="Telegram"
              >
                tg
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#00D9FF] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#00D9FF] transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/categories/digital-marketing" className="hover:text-[#00D9FF] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#00D9FF] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#00D9FF] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[#00D9FF] transition-colors">
                  FAQ & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
              Contact Info
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#00D9FF] shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#00D9FF] shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-[#00D9FF]">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#00D9FF] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-[#00D9FF]">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[#00D9FF] shrink-0" />
                <span>{supportHours}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Methods & Safe Badge */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
              Payment Methods
            </h4>
            <div className="space-y-2">
              {mfsMethods.map((pm) => (
                <div
                  key={pm.slug}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0B1224] border border-[#1B2A45]"
                >
                  <span className={`font-semibold ${getMfsColor(pm.slug)}`}>
                    {pm.displayName}
                  </span>
                  <span className="text-[11px] font-mono text-[#F8FAFC]">
                    {pm.merchantNumber || "Available"}
                  </span>
                </div>
              ))}
              <p className="text-[10px] text-[#94A3B8]/80 text-center italic">
                (Official receiving numbers)
              </p>
            </div>

            {/* Safe & Secure Box */}
            <div className="p-3 rounded-xl bg-[#080D1B] border border-cyan-500/20 flex items-start gap-2.5">
              <ShieldCheck className="h-6 w-6 text-[#00D9FF] shrink-0" />
              <div>
                <span className="text-xs font-semibold text-[#F8FAFC] block">Safe & Secure</span>
                <span className="text-[10px] text-[#94A3B8] leading-tight block">
                  Your data is safe with us. We use industry-standard security measures.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#1B2A45]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>© {new Date().getFullYear()} DigitalHub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-[#00D9FF] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="hover:text-[#00D9FF] transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/refund-policy" className="hover:text-[#00D9FF] transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
