import { LucideIcon } from "lucide-react";

export function StatCard({ title, value, subtitle, icon: Icon }: { title: string; value: string | number; subtitle?: string; icon: LucideIcon }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold">{value}</h3>
          {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
        </div>
        <div className="rounded-2xl bg-slate-100 p-3"><Icon size={22} /></div>
      </div>
    </div>
  );
}
