import { IndianRupee, Target, TrendingUp, Users } from "lucide-react";
import { apiGet } from "@/lib/api";
import { DashboardMetrics } from "@/types/lead";
import { StatCard } from "@/components/StatCard";
import { SimpleBarChart, StatusPieChart } from "@/components/Charts";
import { LeadTable } from "@/components/LeadTable";

export default async function DashboardPage() {
  const metrics = await apiGet<DashboardMetrics>("/dashboard/metrics");
  const insightData = await apiGet<{ provider: string; insights: string[] }>("/dashboard/insights");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lead Dashboard</h1>
        <p className="mt-2 text-slate-500">Real-time overview of leads, status distribution, services, and cities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Leads" value={metrics.totalLeads} icon={Users} />
        <StatCard title="Conversion Rate" value={`${metrics.conversionRate}%`} icon={Target} />
        <StatCard title="Total Budget" value={`₹${metrics.budgetStats.totalBudget.toLocaleString("en-IN")}`} icon={IndianRupee} />
        <StatCard title="Average Budget" value={`₹${metrics.budgetStats.averageBudget.toLocaleString("en-IN")}`} icon={TrendingUp} />
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">AI Insights</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{insightData.provider}</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {insightData.insights.map((item, index) => <div key={index} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{item}</div>)}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold">Status Breakdown</h2>
          <StatusPieChart data={metrics.statusBreakdown} />
        </section>
        <section className="rounded-3xl border bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold">City Distribution</h2>
          <SimpleBarChart data={metrics.cityDistribution} xKey="city" />
        </section>
        <section className="rounded-3xl border bg-white p-6 shadow-soft xl:col-span-2">
          <h2 className="text-xl font-semibold">Service Distribution</h2>
          <SimpleBarChart data={metrics.serviceDistribution} xKey="service" />
        </section>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Recent Leads</h2>
        <LeadTable leads={metrics.recentLeads} />
      </section>
    </div>
  );
}
