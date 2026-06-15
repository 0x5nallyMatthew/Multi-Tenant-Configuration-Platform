import { trustedCompanies } from "../data"

export function TrustBanner() {
    // Duplicate companies for seamless infinite scroll
    const companies = [...trustedCompanies, ...trustedCompanies, ...trustedCompanies]

    return (
        <section className="border-y border-border bg-muted/50 py-8 sm:py-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6 sm:mb-8">
                <p className="text-xs sm:text-label-sm uppercase tracking-widest text-muted-foreground">
                    Trusted by Leading Insurers
                </p>
            </div>

            {/* Auto-sliding marquee using CSS animation */}
            <div className="relative">
                {/* Gradient overlays for smooth fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-muted/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-muted/50 to-transparent z-10 pointer-events-none" />

                <div className="flex animate-marquee whitespace-nowrap">
                    {companies.map((company, i) => (
                        <span
                            key={`${company.name}-${i}`}
                            className={`text-base sm:text-xl text-foreground/60 hover:text-foreground transition-colors mx-5 sm:mx-8 cursor-default ${company.style}`}
                        >
                            {company.name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}
