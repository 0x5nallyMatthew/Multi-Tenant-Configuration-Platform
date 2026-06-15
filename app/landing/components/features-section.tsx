import { features } from "../data"

export function FeaturesSection() {
    return (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
                    <h2 className="text-xl sm:text-2xl lg:text-headline-lg text-foreground">Everything you need to succeed</h2>
                    <p className="text-sm sm:text-body-sm text-muted-foreground">
                        Powerful tools designed to simplify complex insurance workflows.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className={`group rounded-xl border border-border bg-card p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg ${
                                feature.wide ? "sm:col-span-2 md:col-span-1 lg:col-span-2" : ""
                            }`}
                        >
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/15 transition-colors">
                                <feature.icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-sm sm:text-headline-sm text-card-foreground mb-2">{feature.title}</h3>
                            <p className="text-xs sm:text-body-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
