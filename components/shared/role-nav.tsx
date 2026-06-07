"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function RoleNav() {
  const pathname = usePathname()
  const onDashboard = pathname === "/dashboard"

  return (
    <div className="flex rounded-lg border border-white/20 overflow-hidden text-xs">
      <Link
        href="/dashboard"
        className={`px-3 py-1.5 transition-colors ${
          onDashboard ? "bg-white/20 text-white font-medium" : "text-white/60 hover:text-white"
        }`}
      >
        My Compliance
      </Link>
      <Link
        href="/facility"
        className={`px-3 py-1.5 transition-colors ${
          !onDashboard ? "bg-white/20 text-white font-medium" : "text-white/60 hover:text-white"
        }`}
      >
        Facility Overview
      </Link>
    </div>
  )
}
