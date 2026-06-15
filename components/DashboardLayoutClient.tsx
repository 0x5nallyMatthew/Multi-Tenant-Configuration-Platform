"use client"

import React, { useState, useCallback } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  PlusCircle,
  GitCompare,
  LogOut,
  User,
  Activity,
  Menu
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"

// Simple CSS-based animations instead of framer-motion to reduce bundle
const SidebarWrapper = ({ children }: { children: React.ReactNode }) => (
  <aside className="hidden md:flex w-64 bg-card/50 border-r border-border/80 flex-col z-10 backdrop-blur-md">
    {children}
  </aside>
)

const MainContentWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 flex flex-col overflow-hidden relative z-10">
    {children}
  </div>
)

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    id: string
    name?: string | null
    email?: string | null
    role: string
  }
}

export default function DashboardLayoutClient({
  children,
  user,
}: DashboardLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = useCallback(async () => {
    await signOut({ redirectTo: "/login" })
    router.push("/login")
  }, [router])

  const toggleMobileNav = useCallback(() => {
    setMobileNavOpen(prev => !prev)
  }, [])

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        user={user}
        onSignOut={handleSignOut}
        userRole={user.role}
      />

      {/* Sidebar - Hidden on mobile, visible on md+ */}
      <SidebarWrapper>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-border/80 gap-3">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-card/30 border border-border/40 !bg-[#0E1511]">
            <Link href="/tenants" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#4EDEA3] text-black">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold tracking-tight text-[#4EDEA3] text-lg">AInsurance</span>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/tenants"
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
            Tenants list
          </Link>
          <Link
            href="/tenants/new"
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <PlusCircle className="w-5 h-5 text-muted-foreground" />
            Create Tenant
          </Link>
          <Link
            href="/compare"
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <GitCompare className="w-5 h-5 text-muted-foreground" />
            Compare Config
          </Link>
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-border/80 bg-background/20">
          <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-card/30 border border-border/40 mb-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-label-sm text-foreground truncate">{user.name || "User"}</p>
              <p className="text-label-sm text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 text-label-sm cursor-pointer border border-transparent hover:border-destructive/20"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </SidebarWrapper>

      {/* Main Content Area */}
      <MainContentWrapper>
        {/* Top bar / Navbar */}
        <header className="h-16 bg-card/30 border-b border-border/80 flex items-center justify-between px-4 md:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileNav}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-3 md:gap-4">
            <ThemeToggle />
            <span className="px-3 py-1.5 rounded-full bg-muted border border-border/60 text-muted-foreground flex items-center gap-1.5 capitalize font-medium text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              {user.role} mode
            </span>
          </div>
        </header>

        {/* Page children */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background/40">
          {children}
        </main>
      </MainContentWrapper>
    </div>
  )
}
