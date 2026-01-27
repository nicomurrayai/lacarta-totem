"use client";

import { Tab } from "@/types/types";
import clsx from "clsx";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashNavbar({ businessName, tabs }: { businessName: string, tabs: Tab[] }) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <header className="flex flex-col items-start sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <span className="text-gray-600 font-normal text-sm md:text-base">
            Dashboard Totem
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold">
            {businessName}
          </h1>
        </div>
        <Link target="_blank" href="/chiringuito" className="bg-primary text-white p-3 rounded-full flex gap-4">Ver menu <ExternalLink /></Link>
      </header>

      <nav className="mt-6" aria-label="Navegación principal">
        <div className="flex gap-2 bg-gray-50 rounded-full p-1 overflow-x-auto scrollbar-hide whitespace-nowrap snap-x snap-mandatory scroll-smooth">
          {tabs.map(({ name, path, icon: Icon }) => {
            // Normalizar ambas rutas para comparación
            const normalizedPathname = pathname === '/dashboard' ? '/dashboard/' : pathname;
            const isActive = normalizedPathname === path;

            return (
              <Link
                key={path}
                href={path}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "px-6 py-2 rounded-full text-sm font-medium snap-start transition-all duration-300 flex items-center gap-2",
                  isActive
                    ? "bg-primary shadow text-white"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {name}
              </Link>
            );
          })}
        </div>
      </nav>

      <hr className="my-8" />
    </div>
  );
}