"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartHandshake, Home, LayoutDashboard, User } from "lucide-react";

import { useStore } from "@/lib/store";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
}

/**
 * Responsive navigation:
 *  - Desktop (md+): fixed top bar with brand + horizontal links.
 *  - Mobile: fixed bottom tab bar (thumb-friendly).
 * Hidden entirely until a user is "logged in".
 */
export default function Navbar() {
  const { currentUser } = useStore();
  const pathname = usePathname();

  if (!currentUser) return null;

  const dashboardHref =
    currentUser.role === "donor" ? "/donor" : "/shelter";

  const items: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: dashboardHref, label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Desktop top bar */}
      <header className="fixed inset-x-0 top-0 z-40 hidden border-b border-gray-200 bg-white/90 backdrop-blur md:block">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <HeartHandshake className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              ShelterSync
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {items.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive(href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">{currentUser.name}</span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
              {currentUser.role === "donor" ? "Donor" : "Staff"}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white md:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {items.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                href={href}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition ${
                  active ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${active ? "scale-110" : ""} transition-transform`}
                />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
