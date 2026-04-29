import { apiGet, buildQuery } from "@/lib/api";
import { Lead, Paginated } from "@/types/lead";
import { LeadTable } from "@/components/LeadTable";
import { LeadForm } from "./lead-form";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  const query = buildQuery({
    page: params.page || 1,
    limit: 10,
    search: params.search,
  });

  const data = await apiGet<Paginated<Lead>>(`/leads?${query}`);

  const currentPage = data.pagination.page;
  const totalPages = data.pagination.totalPages || 1;

  const createPageUrl = (page: number) => {
    const nextParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
    });

    nextParams.set("page", String(page));

    return `/leads?${nextParams.toString()}`;
  };

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="mt-2 text-slate-500">
            Add, view, update, and delete lead details.
          </p>
        </div>
      </div>

      <LeadForm />

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