import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { APP_CONFIG } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Contact DigitalHub Support — Phone, WhatsApp & Office in Chittagong, Bangladesh",
  description:
    "Contact DigitalHub Bangladesh support team via WhatsApp, phone, or email for instant order verification, custom web development quotes, and subscription renewals.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact DigitalHub Support — Bangladesh",
    description:
      "Get in touch with DigitalHub 24/7 support for bKash/Nagad verification, license keys, and project inquiries.",
    url: "https://digitalhub-mocha.vercel.app/contact",
    type: "website",
  },
};

export default async function ContactPage() {
  let settings: Record<string, string> = {};

  try {
    const settingsList = await prisma.siteSetting.findMany();
    settingsList.forEach((s) => {
      settings[s.key] = s.value;
    });
  } catch (err) {
    console.error("Failed to load siteSettings on contact page:", err);
  }

  const pageTitle = settings.contact_title || "Contact DigitalHub Support";
  const pageSubtitle =
    settings.contact_subtitle ||
    "Have a question about an order, custom website development, or subscription renewal? Reach out to us anytime.";
  const address = settings.business_address || APP_CONFIG.contact.address;
  const phone = settings.contact_phone || APP_CONFIG.contact.phone;
  const email = settings.contact_email || APP_CONFIG.contact.email;
  const supportHours = settings.support_hours || APP_CONFIG.contact.supportHours;
  const whatsapp = settings.social_whatsapp || APP_CONFIG.social.whatsapp;
  const whatsappUrl = whatsapp.startsWith("http")
    ? whatsapp
    : `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`;
  const whatsappDesc =
    settings.contact_whatsapp_desc ||
    "For instant response regarding bKash/Nagad verification, license keys, or project quotes, contact our live representative on WhatsApp.";

  return (
    <div className="py-14 bg-[#050812] min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D9FF]">
            Get In Touch
          </span>
          <h1 className="text-3xl font-extrabold text-[#F8FAFC]">
            {pageTitle}
          </h1>
          <p className="text-xs text-[#94A3B8]">
            {pageSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="p-8 rounded-3xl bg-[#0B1224] border border-[#1B2A45] space-y-6">
            <h2 className="text-base font-bold text-[#F8FAFC]">Direct Contact Channels</h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#00D9FF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8FAFC] block">Office Address</span>
                  <span className="text-[#94A3B8]">{address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8FAFC] block">Phone & WhatsApp</span>
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="text-[#00D9FF] hover:underline font-mono">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8FAFC] block">Email Address</span>
                  <a href={`mailto:${email}`} className="text-[#00D9FF] hover:underline">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8FAFC] block">Operating Hours</span>
                  <span className="text-[#94A3B8]">{supportHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Message Box */}
          <div className="p-8 rounded-3xl bg-[#0B1224] border border-[#1B2A45] space-y-4">
            <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#00D9FF]" />
              Instant WhatsApp Support
            </h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {whatsappDesc}
            </p>
            <div className="pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
