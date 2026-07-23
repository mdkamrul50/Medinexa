"use client";

import PlaceholderPage from "@/components/dashboard/PlaceholderPage";

export default function DoctorsPage() {
  return (
    <PlaceholderPage
      title="Doctors"
      subtitle="Manage hospital doctors and specialists"
      icon="👨‍⚕️"
      breadcrumbs={[
        { label: "Doctors" },
      ]}
    />
  );
}