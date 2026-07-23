"use client";

import PlaceholderPage from "@/components/dashboard/PlaceholderPage";

export default function RecordsPage() {
  return (
    <PlaceholderPage
      title="Medical Records"
      subtitle="Your health records and history"
      icon="📁"
      breadcrumbs={[
        { label: "Records" },
      ]}
    />
  );
}