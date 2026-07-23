"use client";

import PlaceholderPage from "@/components/dashboard/PlaceholderPage";

export default function PrescriptionsPage() {
  return (
    <PlaceholderPage
      title="Prescriptions"
      subtitle="Manage and view medical prescriptions"
      icon="📋"
      breadcrumbs={[
        { label: "Prescriptions" },
      ]}
    />
  );
}