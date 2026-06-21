"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenText,
  CalendarCheck,
  LogOut,
  Mic2,
  PenLine,
  Search,
  Sparkles,
} from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: BarChart3 },
  { href: "/vocabulary", label: "Vocabulary", icon: BookOpenText },
  { href: "/writing", label: "Writing", icon: PenLine },
  { href: "/speaking", label: "Speaking", icon: Mic2 },
  { href: "/plan", label: "Plan", icon: CalendarCheck },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavBar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div>
        <Link href="/" className="flex items-center gap-3 text-ink no-underline">
          <span className="brand-mark">
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-black">BandUp</span>
            <span className="block text-[11px] font-bold text-muted">IELTS Hub</span>
          </span>
        </Link>

        <div className="mt-8 hidden items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-xs font-bold text-muted md:flex">
          <Search size={14} aria-hidden="true" />
          Focus today
        </div>

        <nav className="sidebar-nav mt-8 space-y-2" aria-label="Main navigation">
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link ${active ? "nav-link-active" : ""}`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-honey text-sm font-black text-ink">
            A
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-black text-ink">Amanda</p>
            <p className="truncate text-[11px] font-bold text-muted">Band 6.5 goal</p>
          </div>
        </div>
        <button type="button" className="nav-link w-full justify-start">
          <LogOut size={16} aria-hidden="true" />
          Log out
        </button>
      </div>
    </aside>
  );
}
