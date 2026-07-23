"use client";

import PlaceholderPage from "@/components/dashboard/PlaceholderPage";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      subtitle="System preferences and configuration"
      icon="⚙️"
      breadcrumbs={[
        { label: "Settings" },
      ]}
    />
  );
}