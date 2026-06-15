"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Batch the state update to avoid cascading renders
        requestAnimationFrame(() => setMounted(true))
    }, [])

    // Return placeholder with same dimensions to avoid layout shift
    if (!mounted) {
        return (
            <div className="w-9 h-9" aria-hidden="true" />
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 cursor-pointer"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="w-4 h-4" />
            ) : (
                <Moon className="w-4 h-4" />
            )}
        </button>
    )
}
