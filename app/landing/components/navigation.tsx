"use client"

import { useState } from "react"
import { Activity, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { navLinks } from "../data"
import Link from "next/link"

export function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 px-2 py-1 rounded-lg bg-card/30 border border-border/40 !bg-[#0E1511]">
                            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#4EDEA3] text-black">
                                <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <span className="font-heading font-bold tracking-tight text-[#4EDEA3] text-base sm:text-lg">
                                AInsurance
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-muted-foreground">
                        {navLinks.map((item) => (
                            <a
                                key={item}
                                href="#"
                                className={
                                    item === "Features"
                                        ? "text-primary font-semibold border-b-2 border-primary pb-0.5"
                                        : "hover:text-foreground transition-colors"
                                }
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
                        <a
                            href="/signup"
                            className="bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-lg shadow-primary/20"
                        >
                            Request Demo
                        </a>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Simple CSS transition */}
            <div
                className={`md:hidden border-t border-border bg-background/95 backdrop-blur-md overflow-hidden transition-all duration-200 ${
                    mobileMenuOpen ? "max-h-96" : "max-h-0 border-t-0"
                }`}
            >
                <div className="px-4 py-4 space-y-3">
                    {navLinks.map((item) => (
                        <a
                            key={item}
                            href="#"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block py-2 text-sm font-medium transition-colors ${
                                item === "Features"
                                    ? "text-primary font-semibold"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {item}
                        </a>
                    ))}
                    <div className="pt-3 border-t border-border">
                        <a
                            href="/signup"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full text-center bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-primary/20"
                        >
                            Request Demo
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}
