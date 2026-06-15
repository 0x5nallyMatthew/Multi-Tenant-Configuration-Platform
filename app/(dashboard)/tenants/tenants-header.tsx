"use client"

import React from "react"
import Link from "next/link"
import dynamic from "next/dynamic"

// Dynamic import for icons
const LayoutDashboard = dynamic(() => import("lucide-react").then(m => ({ default: m.LayoutDashboard })))
const Plus = dynamic(() => import("lucide-react").then(m => ({ default: m.Plus })))

interface TenantsHeaderProps {
  userRole: string
}

export default function TenantsHeader({ userRole }: TenantsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          Insurance Tenants
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage tenant branding, claim logic, SLAs, and custom forms
        </p>
      </div>
      {userRole === "admin" && (
        <Link
          href="/tenants/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/10"
        >
          <Plus className="w-4 h-4" />
          Create Tenant
        </Link>
      )}
    </div>
  )
}
