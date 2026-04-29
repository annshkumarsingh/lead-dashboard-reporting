import { apiBaseUrl, apiGet, buildQuery } from "@/lib/api";
import { Lead, Paginated } from "@/types/lead";
import { LeadTable } from "@/components/LeadTable";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const query = buildQuery({
    page: params.page || 1,
    limit: 20,
    fromDate: params.fromDate,
    toDate: params.toDate,
    city: params.city,
    status: params.status,
    service: params.service,
    search: params.search,
  });
  const data = await apiGet<Paginated<Lead>>(`/reports/leads?${query}`);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="mt-2 text-slate-500">Filter leads and export CSV or Excel reports.</p>
      </div>

      <form className="rounded-3xl border bg-white p-6 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input type="date" name="fromDate" defaultValue={params.fromDate} className="rounded-2xl border px-4 py-3" />
          <input type="date" name="toDate" defaultValue={params.toDate} className="rounded-2xl border px-4 py-3" />
          <input name="city" placeholder="City" defaultValue={params.city} className="rounded-2xl border px-4 py-3" />
          <input name="service" placeholder="Service" defaultValue={params.service} className="rounded-2xl border px-4 py-3" />
          <select name="status" defaultValue={params.status || ""} className="rounded-2xl border px-4 py-3">
            <option value="">All Status</option><option>New</option><option>Interested</option><option>Converted</option><option>Rejected</option>
          </select>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white">Apply Filters</button>
          <a href="/reports" className="rounded-2xl border px-5 py-3 font-semibold">Reset</a>
          <a href={`${apiBaseUrl}/reports/leads/export?${query}&format=csv`} className="rounded-2xl border px-5 py-3 font-semibold">Export CSV</a>
          <a href={`${apiBaseUrl}/reports/leads/export?${query}&format=xlsx`} className="rounded-2xl border px-5 py-3 font-semibold">Export Excel</a>
        </div>
      </form>

      <LeadTable leads={data.items} showActions />

      <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          Page {data.pagination.page} of {data.pagination.totalPages || 1} · Showing{" "}
          {data.items.length} of {data.pagination.total} matching leads
        </div>

        <div className="flex items-center gap-2">
          {data.pagination.page > 1 ? (
            <a
              href={`/reports?${buildQuery({
                ...params,
                page: data.pagination.page - 1,
              })}`}
              className="rounded-xl border px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              Prev
            </a>
          ) : (
            <button
              disabled
              className="cursor-not-allowed rounded-xl border px-4 py-2 font-medium text-slate-300"
            >
              Prev
            </button>
          )}

          {data.pagination.page < (data.pagination.totalPages || 1) ? (
            <a
              href={`/reports?${buildQuery({
                ...params,
                page: data.pagination.page + 1,
              })}`}
              className="rounded-xl border px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              Next
            </a>
          ) : (
            <button
              disabled
              className="cursor-not-allowed rounded-xl border px-4 py-2 font-medium text-slate-300"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
