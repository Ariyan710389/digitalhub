import React from "react";
import { APP_CONFIG } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="py-14 bg-[#050812] min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D9FF]">
            Get In Touch
          </span>
          <h1 className="text-3xl font-extrabold text-[#F8FAFC]">
            Contact DigitalHub Support
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Have a question about an order, custom website development, or subscription renewal? Reach out to us anytime.
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
                  <span className="text-[#94A3B8]">{APP_CONFIG.contact.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8FAFC] block">Phone & WhatsApp</span>
                  <a href={`tel:${APP_CONFIG.contact.phone}`} className="text-[#00D9FF] hover:underline font-mono">
                    {APP_CONFIG.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8FAFC] block">Email Address</span>
                  <a href={`mailto:${APP_CONFIG.contact.email}`} className="text-[#00D9FF] hover:underline">
                    {APP_CONFIG.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8FAFC] block">Operating Hours</span>
                  <span className="text-[#94A3B8]">{APP_CONFIG.contact.supportHours}</span>
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
              For instant response regarding bKash/Nagad verification, license keys, or project quotes, contact our live representative on WhatsApp.
            </p>
            <div className="pt-4">
              <a
                href={APP_CONFIG.social.whatsapp}
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
