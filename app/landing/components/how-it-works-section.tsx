import { steps } from "../data"

export function HowItWorksSection() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-t border-border overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
                    <h2 className="text-headline-lg text-foreground">How It Works</h2>
                    <p className="text-body-sm text-muted-foreground">
                        Get up and running in three simple steps.
                    </p>
                </div>

                {/* Desktop & Tablet: Horizontal layout */}
                <div className="hidden md:block">
                    <div className="flex items-start justify-between max-w-4xl mx-auto">
                        {steps.map((step) => (
                            <div key={step.num} className="flex items-center">
                                <div className="text-center space-y-4 w-52">
                                    <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center border-4 border-background">
                                        <span className="text-xl lg:text-2xl font-bold text-primary">{step.num}</span>
                                    </div>
                                    <h3 className="text-base lg:text-headline-sm text-foreground">{step.title}</h3>
                                    <p className="text-xs lg:text-body-sm text-muted-foreground">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile: Vertical layout */}
                <div className="md:hidden">
                    <div className="flex flex-col items-center">
                        {steps.map((step, index) => (
                            <div key={step.num} className="flex flex-col items-center">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center border-4 border-background">
                                        <span className="text-xl font-bold text-primary">{step.num}</span>
                                    </div>
                                    <h3 className="text-base text-foreground">{step.title}</h3>
                                    <p className="text-xs text-muted-foreground max-w-[250px]">{step.desc}</p>
                                </div>

                                {/* Vertical connector line */}
                                {index < steps.length - 1 && (
                                    <div className="w-0.5 h-8 bg-border my-4" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
