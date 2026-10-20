"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to subscribe.");
        setIsSuccess(false);
      } else {
        setMessage(data.message);
        setIsSuccess(true);
        setEmail("");
      }
    } catch {
      setMessage("An unexpected error occurred. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-[#101A30] to-[#080D1B] border border-[#1B2A45] p-8 sm:p-12 relative shadow-2xl">
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#00D9FF] bg-[#00D9FF]/10 px-3 py-1 rounded-full border border-[#00D9FF]/20 inline-block mb-3">
              Stay in the loop
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Get Exclusive Digital Deals & Updates
            </h2>
            <p className="text-sm text-[#94A3B8] mt-2">
              Subscribe for flash sales on AI tools, software license drops, and web development discounts delivered directly to your inbox.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full md:w-auto flex-1 max-w-md flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0B1224] border border-[#1B2A45] rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF]/30 transition-all"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="shrink-0 flex items-center justify-center gap-1.5"
              >
                {loading ? "Joining..." : "Subscribe"}
                {!loading && <ArrowRight className="w-3.5 h-3.5" />}
              </Button>
            </div>

            {message && (
              <div
                className={`text-xs flex items-center gap-1.5 ${
                  isSuccess ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isSuccess && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                <span>{message}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
