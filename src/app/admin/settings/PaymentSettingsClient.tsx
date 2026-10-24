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
  Headphones,
  CreditCard,
  Layers,
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
  const [activeTab, setActiveTab] = useState<"all" | "contact" | "payments" | "social">("all");
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

      {/* Quick Navigation Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "all"
              ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_15px_rgba(0,217,255,0.4)]"
              : "bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC]"
          }`}
        >
          Show All
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "contact"
              ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_15px_rgba(0,217,255,0.4)]"
              : "bg-[#0B1224] border border-[#1B2A45] text-[#00D9FF] hover:border-[#00D9FF]"
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Contact DigitalHub Support</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "payments"
              ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_15px_rgba(0,217,255,0.4)]"
              : "bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC]"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>bKash / Nagad / Rocket</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "social"
              ? "bg-[#00D9FF] text-[#050812] shadow-[0_0_15px_rgba(0,217,255,0.4)]"
              : "bg-[#0B1224] border border-[#1B2A45] text-[#94A3B8] hover:text-[#F8FAFC]"
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Social Media Links</span>
        </button>
      </div>

      {/* 1. Contact DigitalHub Support Settings Card */}
      {(activeTab === "all" || activeTab === "contact") && (
        <div className="rounded-3xl bg-[#0B1224] border-2 border-[#00D9FF]/40 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#00D9FF]/10 text-[#00D9FF] border-b border-l border-[#00D9FF]/30 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            Contact Page Settings
          </div>

          <div className="flex items-center gap-3 border-b border-[#1B2A45] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00D9FF]">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#F8FAFC]">
                Contact DigitalHub Support Settings
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Edit everything displayed on the Contact DigitalHub Support page (/contact) and footer.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#F8FAFC] mb-1">
                Contact Page Heading / Title
              </label>
              <input
                type="text"
                value={siteSettings.contact_title || "Contact DigitalHub Support"}
                onChange={(e) => handleSettingChange("contact_title", e.target.value)}
                placeholder="e.g. Contact DigitalHub Support"
                className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F8FAFC] mb-1">
                Office Address (Direct Contact Channels)
              </label>
              <input
                type="text"
                value={siteSettings.business_address || "Chittagong, Bangladesh"}
                onChange={(e) => handleSettingChange("business_address", e.target.value)}
                placeholder="e.g. 123 Digital Street, Mirpur, Dhaka or Chittagong, Bangladesh"
                className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#00D9FF] font-semibold focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F8FAFC] mb-1">
                Phone & WhatsApp Number
              </label>
              <input
                type="text"
                value={siteSettings.contact_phone || "+880 1873168818"}
                onChange={(e) => handleSettingChange("contact_phone", e.target.value)}
                placeholder="e.g. +880 1873168818"
                className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#00D9FF] font-mono font-semibold focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F8FAFC] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={siteSettings.contact_email || "info@digitalhub.com"}
                onChange={(e) => handleSettingChange("contact_email", e.target.value)}
                placeholder="e.g. info@digitalhub.com"
                className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F8FAFC] mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={siteSettings.support_hours || "Support: 24/7 Available"}
                onChange={(e) => handleSettingChange("support_hours", e.target.value)}
                placeholder="e.g. Support: 24/7 Available or 10:00 AM - 11:00 PM"
                className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F8FAFC] mb-1">
                Instant WhatsApp Chat Link or Number
              </label>
              <input
                type="text"
                value={siteSettings.social_whatsapp || "https://wa.link/xyj473"}
                onChange={(e) => handleSettingChange("social_whatsapp", e.target.value)}
                placeholder="e.g. https://wa.link/xyj473 or +8801873168818"
                className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#F8FAFC] mb-1">
                Contact Page Subtitle / Tagline
              </label>
              <textarea
                rows={2}
                value={
                  siteSettings.contact_subtitle ||
                  "Have a question about an order, custom website development, or subscription renewal? Reach out to us anytime."
                }
                onChange={(e) => handleSettingChange("contact_subtitle", e.target.value)}
                className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#94A3B8] focus:outline-none focus:border-[#00D9FF] resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#F8FAFC] mb-1">
                Instant WhatsApp Support Box Description
              </label>
              <textarea
                rows={2}
                value={
                  siteSettings.contact_whatsapp_desc ||
                  "For instant response regarding bKash/Nagad verification, license keys, or project quotes, contact our live representative on WhatsApp."
                }
                onChange={(e) => handleSettingChange("contact_whatsapp_desc", e.target.value)}
                className="w-full rounded-xl bg-[#080D1B] border border-[#1B2A45] px-3.5 py-2.5 text-xs text-[#94A3B8] focus:outline-none focus:border-[#00D9FF] resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Bangladesh Payment Methods (bKash, Nagad, Rocket, COD) Card */}
      {(activeTab === "all" || activeTab === "payments") && (
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
      )}

      {/* 3. Social Media Channels Card */}
      {(activeTab === "all" || activeTab === "social") && (
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
      )}

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
