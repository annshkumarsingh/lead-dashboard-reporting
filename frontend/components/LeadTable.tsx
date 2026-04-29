import { Lead } from "@/types/lead";
import { DeleteLeadButton } from "./DeleteLeadButton";

const statusClass: Record<string, string> = {
  New: "bg-blue-50 text-blue-700",
  Interested: "bg-amber-50 text-amber-700",
  Converted: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
};

export function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Contact</th>
              <th className="px-5 py-4">City</th>
              <th className="px-5 py-4">Service</th>
              <th className="px-5 py-4">Budget</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-medium">{lead.name}</td>
                <td className="px-5 py-4 text-slate-600"><div>{lead.mobile}</div><div>{lead.email}</div></td>
                <td className="px-5 py-4">{lead.city}</td>
                <td className="px-5 py-4">{lead.service}</td>
                <td className="px-5 py-4">₹{Number(lead.budget).toLocaleString("en-IN")}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[lead.status]}`}>{lead.status}</span></td>
                <td className="px-2 py-4">{<DeleteLeadButton leadId={`${lead._id}`} leadName={`${lead.name}` }/>}</td>
              </tr>
            ))}
            {!leads.length && <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-500">No leads found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
