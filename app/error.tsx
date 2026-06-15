"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center max-w-md p-8 rounded-2xl bg-card border border-border shadow-lg">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-destructive/10 mb-6">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                    Something went wrong!
                </h2>
                <p className="text-sm text-muted-foreground text-center mb-6">
                    {error.message || "An unexpected error occurred"}
                </p>
                <button
                    onClick={reset}
                    className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    )
}