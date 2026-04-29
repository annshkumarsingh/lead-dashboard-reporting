"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiJson } from "@/lib/api";
import type { SubmitEvent } from "react";

const statuses = ["New", "Interested", "Converted", "Rejected"];

export function LeadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;

    setError(null);
    setLoading(true);

    const form = new FormData(formElement);

    const payload = {
      name: String(form.get("name") || "").trim(),
      mobile: String(form.get("mobile") || "").trim(),
      email: String(form.get("email") || "").trim().toLowerCase(),
      city: String(form.get("city") || "").trim(),
      service: String(form.get("service") || "").trim(),
      budget: String(Number(form.get("budget") || 0)),
      status: String(form.get("status") || "New"),
    };

    try {
      await apiJson("/leads", "POST", payload);

      formElement.reset();
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to create lead");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border bg-white p-6 shadow-soft">
      <h2 className="mb-5 text-xl font-semibold">Add New Lead</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input name="name" required placeholder="Name" className="rounded-2xl border px-4 py-3" />
        <input name="mobile" required placeholder="Mobile" className="rounded-2xl border px-4 py-3" />
        <input name="email" required type="email" placeholder="Email" className="rounded-2xl border px-4 py-3" />
        <input name="city" required placeholder="City" className="rounded-2xl border px-4 py-3" />
        <input name="service" required placeholder="Service" className="rounded-2xl border px-4 py-3" />
        <input name="budget" required type="number" min="0" placeholder="Budget" className="rounded-2xl border px-4 py-3" />
        <select name="status" className="rounded-2xl border px-4 py-3">{statuses.map((s) => <option key={s}>{s}</option>)}</select>
        <button disabled={loading} className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? "Saving..." : "Add Lead"}</button>
      </div>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 mt-5 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
    </form>
  );
}
