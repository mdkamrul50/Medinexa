"use client";

import PlaceholderPage from "@/components/dashboard/PlaceholderPage";

export default function BillingPage() {
  return (
    <PlaceholderPage
      title="Billing"
      subtitle="Invoices, payments, and financial records"
      icon="💰"
      breadcrumbs={[
        { label: "Billing" },
      ]}
    />
  );
}