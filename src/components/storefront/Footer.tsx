import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
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
                <Image
                  src="/images/logo.jpg"
                  alt="DigitalHub Bangladesh Logo"
                  width={36}
                  height={36}
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

          {/* Column 4: Security & Buyer Protection */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
              Security & Trust
            </h4>

            {/* Safe & Secure Box */}
            <div className="p-3.5 rounded-xl bg-[#0B1224] border border-[#1B2A45] flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-[#00D9FF] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-[#F8FAFC] block">Safe & Secure</span>
                <span className="text-[11px] text-[#94A3B8] leading-relaxed block mt-0.5">
                  Your personal data and orders are protected with industry-standard encryption.
                </span>
              </div>
            </div>

            {/* Buyer Protection Box */}
            <div className="p-3.5 rounded-xl bg-[#0B1224] border border-[#1B2A45] flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-[#F8FAFC] block">100% Genuine Guarantee</span>
                <span className="text-[11px] text-[#94A3B8] leading-relaxed block mt-0.5">
                  All subscriptions and licenses are authentic with instant replacement warranty.
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
