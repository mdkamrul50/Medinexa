"use client";

import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  icon: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PlaceholderPage({ title, subtitle, icon, breadcrumbs }: PlaceholderPageProps) {
  return (
    <DashboardLayout>
      <PageContainer
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs ?? [{ label: title }]}
      >
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h3 className="text-lg font-bold text-heading mb-2">{title}</h3>
          <p className="text-sm text-muted max-w-sm mb-6">
            This feature is under active development and will be available soon.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
