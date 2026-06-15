import { ArrowRight, PlayCircle, BarChart3, Shield, Zap } from "lucide-react"
import Link from "next/link"

const heroSlides = [
    { icon: BarChart3, title: "Real-Time Dashboard", subtitle: "Live claims processing & analytics" },
    { icon: Shield, title: "Enterprise Security", subtitle: "SOC 2 Type II certified infrastructure" },
    { icon: Zap, title: "Instant Deployments", subtitle: "Zero-downtime tenant configuration rollout" },
]

/**
 * Static hero section - no client-side JavaScript required.
 * This ensures fast FCP and LCP for the landing page.
 */
export function HeroStatic() {
    return (
        <section className="relative overflow-hidden">
            {/* Static decorative blobs - using CSS for subtle effect */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-primary/5 blur-[100px] sm:blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-secondary/5 blur-[100px] sm:blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                    {/* Left content - Static, no animations */}
                    <div className="space-y-5 sm:space-y-6">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display-lg text-foreground leading-tight">
                            Modern Insurance Software{" "}
                            <span className="text-primary">Built for Growth.</span>
                        </h1>
                        <p className="text-sm sm:text-base lg:text-body-md text-muted-foreground max-w-lg">
                            Streamline operations, enhance customer experience, and accelerate your agency&apos;s growth with our
                            comprehensive cloud-native platform designed specifically for forward-thinking insurance teams.
                        </p>
                        <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
                            <Link
                                href="/signup"
                                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 font-semibold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Start Free Trial
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button
                                className="inline-flex items-center justify-center gap-2 border border-border text-foreground hover:bg-muted font-semibold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors cursor-pointer"
                            >
                                <PlayCircle className="w-4 h-4" />
                                Watch Video
                            </button>
                        </div>
                    </div>

                    {/* Hero visual - Static, no carousel */}
                    <div className="rounded-2xl border border-border bg-muted aspect-[4/3] relative overflow-hidden shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-4 sm:p-6 space-y-2 sm:space-y-3">
                                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 mx-auto">
                                    <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                                </div>
                                <p className="text-xs sm:text-sm font-semibold text-foreground">
                                    Real-Time Dashboard
                                </p>
                                <p className="text-[10px] sm:text-xs uppercase tracking-wider font-mono text-muted-foreground">
                                    Live claims processing & analytics
                                </p>
                            </div>
                        </div>

                        {/* Static slide indicators */}
                        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                            <div className="h-1.5 sm:h-2 rounded-full bg-primary w-4 sm:w-6" />
                            <div className="h-1.5 sm:h-2 rounded-full bg-border w-1.5 sm:w-2" />
                            <div className="h-1.5 sm:h-2 rounded-full bg-border w-1.5 sm:w-2" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
