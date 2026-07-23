"use client";

import PlaceholderPage from "@/components/dashboard/PlaceholderPage";

export default function LaboratoryPage() {
  return (
    <PlaceholderPage
      title="Laboratory"
      subtitle="Lab tests, results, and diagnostics"
      icon="🔬"
      breadcrumbs={[
        { label: "Laboratory" },
      ]}
    />
  );
}