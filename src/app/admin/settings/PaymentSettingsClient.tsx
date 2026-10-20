"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import {
  Save,
  ShieldCheck,
  Phone,
  Share2,
  MapPin,
  Clock,
  Mail,
  CheckCircle,
} from "lucide-react";

interface PaymentMethodItem {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  merchantNumber?: string | null;
  accountType?: string | null;
  instructions?: string | null;
  isActive: boolean;
}

interface Props {
  initialMethods: PaymentMethodItem[];
  initialSettings: Record<string, string>;
}

export function PaymentSettingsClient({ initialMethods, initialSettings }: Props) {
  const [methods, setMethods] = useState<PaymentMethodItem[]>(initialMethods);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleMethodChange = (slug: string, field: keyof PaymentMethodItem, value: any) => {
    setMethods((prev) =>
      prev.map((m) => (m.slug === slug ? { ...m, [field]: value } : m))
    );
  };

  const handleSettingChange = (key: string, value: string) => {
    setSiteSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethods: methods,
          siteSettings: siteSettings,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update settings");
      }

      setSuccessMsg("Settings updated successfully! Changes are live across the store.");
      toast.success("Settings updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Error saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Bangladesh Payment Methods (bKash, Nagad, Rocket, COD) Card */}
      <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1B2A45] pb-4">
          <div className="flex items-center gap-2.5">
            <Phone className="h-5 w-5 text-[#00D9FF]" />
            <div>
              <h2 className="text-base font-bold text-[#F8FAFC]">
                Mobile Financial Services (MFS) & Payment Gateways
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Set receiving numbers for bKash, Nagad, and Rocket. These appear directly on checkout.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-xs text-[#00D9FF] bg-[#00D9FF]/10 px-3 py-1 rounded-full font-bold border border-[#00D9FF]/20">
            Live Settings
          </span>
        </div>

        <div className="space-y-6">
          {methods.map((pm) => (
            <div
              key={pm.slug}
              className="p-5 rounded-2xl bg-[#080D1B] border border-[#1B2A45] space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-[#F8FAFC]">
                    {pm.displayName}
                  </span>
                  <span className="text-[11px] font-mono text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded-md">
                    {pm.slug.toUpperCase()}
                  </span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-[#94A3B8]">Active on Store:</span>
                  <input
                    type="checkbox"
                    checked={pm.isActive}
                    onChange={(e) => handleMethodChange(pm.slug, "isActive", e.target.checked)}
                    className="w-4 h-4 accent-[#00D9FF] rounded cursor-pointer"
                  />
                </label>
              </div>

              {pm.slug !== "cod" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Receiving / Merchant Number *
                    </label>
                    <input
                      type="text"
                      value={pm.merchantNumber || ""}
                      onChange={(e) =>
                        handleMethodChange(pm.slug, "merchantNumber", e.target.value)
                      }
                      placeholder="e.g. 01712345678"
                      className="w-full rounded-xl bg-[#0B1224] border border-[#1B2A45] px-3.5 py-2.5 text-xs font-mono text-[#00D9FF] focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Account Type (Personal / Merchant / Agent)
                    </label>
                    <input
                      type="text"
                      value={pm.accountType || ""}
                      onChange={(e) =>
                        handleMethodChange(pm.slug, "accountType", e.target.value)
                      }
                      placeholder="e.g. Personal (Send Money) or Merchant (Make Payment)"
                      className="w-full rounded-xl bg-[#0B1224] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Customer Payment Instructions
                </label>
                <textarea
                  rows={2}
                  value={pm.instructions || ""}
                  onChange={(e) =>
                    handleMethodChange(pm.slug, "instructions", e.target.value)
                  }
                  placeholder="e.g. Send Money to our Personal number above and submit your Transaction ID (TrxID) below..."
                  className="w-full rounded-xl bg-[#0B1224] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF] resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Social Media Channels Card */}
      <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-[#1B2A45] pb-4">
          <Share2 className="h-5 w-5 text-[#8B3DFF]" />
          <div>
            <h2 className="text-base font-bold text-[#F8FAFC]">
              Social Media Channels & Direct Chat
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              These links appear in the website header, footer, and contact sections.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              WhatsApp Link or Number
            </label>
            <input
              type="text"
              value={siteSettings.social_whatsapp || ""}
              onChange={(e) => handleSettingChange("social_whatsapp", e.target.value)}
              placeholder="e.g. https://wa.me/8801712345678 or 01712345678"
              className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Facebook Page URL
            </label>
            <input
              type="text"
              value={siteSettings.social_facebook || ""}
              onChange={(e) => handleSettingChange("social_facebook", e.target.value)}
              placeholder="https://facebook.com/yourpage"
              className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Telegram Channel or Support Link
            </label>
            <input
              type="text"
              value={siteSettings.social_telegram || ""}
              onChange={(e) => handleSettingChange("social_telegram", e.target.value)}
              placeholder="https://t.me/yourusername"
              className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              YouTube Channel URL
            </label>
            <input
              type="text"
              value={siteSettings.social_youtube || ""}
              onChange={(e) => handleSettingChange("social_youtube", e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Instagram Profile URL
            </label>
            <input
              type="text"
              value={siteSettings.social_instagram || ""}
              onChange={(e) => handleSettingChange("social_instagram", e.target.value)}
              placeholder="https://instagram.com/yourhandle"
              className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
            />
          </div>
        </div>
      </div>

      {/* 3. Website & Contact Information Card */}
      <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-[#1B2A45] pb-4">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-[#F8FAFC]">
              Website Brand & Contact Settings
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Official company contact information displayed in the footer and support pages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Store Support Email
            </label>
            <input
              type="email"
              value={siteSettings.contact_email || "info@digitalhub.com"}
              onChange={(e) => handleSettingChange("contact_email", e.target.value)}
              className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Support Phone / Helpline
            </label>
            <input
              type="text"
              value={siteSettings.contact_phone || "+880 1712 345678"}
              onChange={(e) => handleSettingChange("contact_phone", e.target.value)}
              className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Business Address
            </label>
            <input
              type="text"
              value={siteSettings.business_address || "Dhaka, Bangladesh"}
              onChange={(e) => handleSettingChange("business_address", e.target.value)}
              className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Support Hours
            </label>
            <input
              type="text"
              value={siteSettings.support_hours || "24/7 Available"}
              onChange={(e) => handleSettingChange("support_hours", e.target.value)}
              className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSaving}
          className="px-8 font-bold text-xs"
        >
          <Save className="h-4 w-4 mr-2" />
          <span>Save All Settings</span>
        </Button>
      </div>
    </form>
  );
}
