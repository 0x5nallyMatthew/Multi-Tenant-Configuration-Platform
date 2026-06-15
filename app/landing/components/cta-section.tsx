import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
    return (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-primary/5 border-y border-border">
            <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl lg:text-headline-lg text-foreground">
                    Ready to transform your insurance operations?
                </h2>
                <p className="text-sm sm:text-base lg:text-body-md text-muted-foreground max-w-xl mx-auto">
                    Join leading insurers who trust our platform to streamline their workflows and accelerate growth.
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-2">
                    <Link
                        href="/signup"
                        className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 font-semibold text-xs sm:text-sm px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Start Free Trial
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center border border-border text-foreground hover:bg-muted font-semibold text-xs sm:text-sm px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </section>
    )
}
