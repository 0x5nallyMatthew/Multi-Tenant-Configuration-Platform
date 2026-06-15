"use client"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="flex h-screen items-center justify-center bg-background text-foreground">
                    <div className="flex flex-col items-center max-w-md p-8">
                        <h2 className="text-xl font-semibold mb-3">
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
            </body>
        </html>
    )
}