"use client";

import PlaceholderPage from "@/components/dashboard/PlaceholderPage";

export default function AppointmentsPage() {
  return (
    <PlaceholderPage
      title="Appointments"
      subtitle="Schedule and manage patient appointments"
      icon="📅"
      breadcrumbs={[
        { label: "Appointments" },
      ]}
    />
  );
}