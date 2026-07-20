import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PageContainer
        title="Dashboard"
        subtitle="Welcome back, Dr. Jenkins. Here is your hospital overview."
        breadcrumbs={[{ label: "Dashboard" }]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Patients", value: "12,840", change: "+12.5%", color: "from-blue-500 to-primary" },
            { label: "Active Appointments", value: "48", change: "+8 today", color: "from-teal-500 to-secondary" },
            { label: "Available Beds", value: "124", change: "34% occupied", color: "from-amber-500 to-accent" },
            { label: "Revenue (MTD)", value: "$284.5K", change: "+18.2%", color: "from-violet-500 to-purple-500" },
          ].map((stat, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />
              <p className="text-sm font-semibold text-muted">{stat.label}</p>
              <p className="text-3xl font-extrabold text-heading tracking-tight mt-1">
                {stat.value}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <div
                  className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${stat.color}`}
                />
                <span className="text-xs font-medium text-body">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
