"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenText,
  CalendarCheck,
  Mic2,
  PenLine,
  Sparkles,
} from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/vocabulary", label: "Vocabulary", icon: BookOpenText },
  { href: "/writing", label: "Writing", icon: PenLine },
  { href: "/speaking", label: "Speaking", icon: Mic2 },
  { href: "/plan", label: "Study Plan", icon: CalendarCheck },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/88 backdrop-blur">
      <div className="shell flex min-h-16 flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between md:gap-6">
        <Link href="/" className="flex items-center gap-3 font-black text-ink">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky text-white">
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg">BandUp</span>
            <span className="block text-xs font-bold text-muted">IELTS Study Hub</span>
          </span>
        </Link>

        <nav className="flex gap-2 overflow-x-auto pb-1 md:pb-0" aria-label="Main navigation">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-bold transition ${
                  active
                    ? "border-sky bg-sky text-white"
                    : "border-transparent bg-white text-slate-600 hover:border-line hover:text-sky"
                }`}
              >
                <Icon size={17} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
