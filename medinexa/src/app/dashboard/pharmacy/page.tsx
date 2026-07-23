"use client";

import PlaceholderPage from "@/components/dashboard/PlaceholderPage";

export default function PharmacyPage() {
  return (
    <PlaceholderPage
      title="Pharmacy"
      subtitle="Medicine inventory and prescriptions"
      icon="💊"
      breadcrumbs={[
        { label: "Pharmacy" },
      ]}
    />
  );
}