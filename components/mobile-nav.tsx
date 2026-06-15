"use client"

import React from "react"
import Link from "next/link"
import {
    LayoutDashboard,
    PlusCircle,
    GitCompare,
    LogOut,
    User as UserIcon,
    ShieldCheck,
    Activity,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

interface MobileNavProps {
    isOpen: boolean
    onClose: () => void
    user: {
        name?: string | null
        role?: string
    }
    onSignOut: () => void
    userRole?: string
}

export function MobileNav({ isOpen, onClose, user, onSignOut, userRole }: MobileNavProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="w-64 p-0 bg-surface-container text-primary-container backdrop-blur-md">
                <SheetHeader className="h-16 flex items-center px-6 border-b border-outline-variant/30">
                    <SheetTitle className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-card/30 border border-border/40 !bg-[#0E1511]">
                            <Link href="/tenants" className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#4EDEA3] text-black">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <span className="font-heading font-bold tracking-tight text-[#4EDEA3] text-lg">AInsurance</span>
                            </Link>
                        </div>
                    </SheetTitle>
                </SheetHeader>

                <nav className="flex-1 space-y-1">
                    <Link
                        href="/tenants"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-all duration-200 text-label-md"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Tenants list
                    </Link>
                    <Link
                        href="/tenants/new"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-all duration-200 text-label-md"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Create Tenant
                    </Link>
                    <Link
                        href="/compare"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-all duration-200 text-label-md"
                    >
                        <GitCompare className="w-5 h-5" />
                        Compare Config
                    </Link>
                </nav>

                <div className="p-spacing-md border-t border-outline-variant/30 bg-surface-container-low p-2">
                    <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-surface-container border border-outline-variant/10 mb-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary">
                            <UserIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-label-md text-primary truncate">{user.name || "User"}</p>
                            <p className="text-label-sm text-on-surface-variant capitalize">{user.role}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                        <ThemeToggle />
                        <span className="px-3 py-1.5 rounded-full bg-muted border border-border/60 text-muted-foreground flex items-center gap-1.5 capitalize font-medium text-label-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                            {userRole || user.role} mode
                        </span>
                    </div>

                    <button
                        onClick={() => {
                            onClose()
                            onSignOut()
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-all duration-200 text-label-sm cursor-pointer border border-outline-variant/10 hover:border-error/20"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
