import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, FileText, LayoutDashboard } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lead Dashboard",
  description: "Lead management and reporting dashboard",
};

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileText },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen lg:flex">
          <aside className="border-r bg-white lg:fixed lg:inset-y-0 lg:w-72">
            <div className="p-6">
              <Link href="/dashboard" className="text-2xl font-bold tracking-tight">LeadOS</Link>
              <p className="mt-1 text-sm text-slate-500">Dashboard & Reporting</p>
            </div>
            <nav className="space-y-2 px-4">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  <item.icon size={18} /> {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="w-full lg:ml-72">
            <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
