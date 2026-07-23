"use client";

import PlaceholderPage from "@/components/dashboard/PlaceholderPage";

export default function HelpPage() {
  return (
    <PlaceholderPage
      title="Help Center"
      subtitle="Documentation, guides, and support"
      icon="❓"
      breadcrumbs={[
        { label: "Help Center" },
      ]}
    />
  );
}