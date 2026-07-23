"use client";

import PlaceholderPage from "@/components/dashboard/PlaceholderPage";

export default function DepartmentsPage() {
  return (
    <PlaceholderPage
      title="Departments"
      subtitle="Hospital department management"
      icon="🏥"
      breadcrumbs={[
        { label: "Departments" },
      ]}
    />
  );
}