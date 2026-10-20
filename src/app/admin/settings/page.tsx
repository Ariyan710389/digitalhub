import React from "react";
import { prisma } from "@/lib/prisma";
import { PaymentSettingsClient } from "./PaymentSettingsClient";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const paymentMethods = await prisma.paymentMethodSetting.findMany({
    orderBy: { displayOrder: "asc" },
  });

  const siteSettingsList = await prisma.siteSetting.findMany();
  const siteSettingsMap: Record<string, string> = {};
  siteSettingsList.forEach((s) => {
    siteSettingsMap[s.key] = s.value;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#F8FAFC]">
          Payment & Platform Settings
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Update bKash, Nagad, and Rocket receiving numbers, account types, and instructions.
          Changes reflect immediately across checkout and footer without code redeployment.
        </p>
      </div>

      <PaymentSettingsClient
        initialMethods={paymentMethods}
        initialSettings={siteSettingsMap}
      />
    </div>
  );
}
