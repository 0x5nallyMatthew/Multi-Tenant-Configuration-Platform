import { ChevronDown } from "lucide-react"
import { faqs } from "../data"

export function FAQSection() {
    return (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 border-t border-border">
            <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
                <h2 className="text-xl sm:text-2xl lg:text-headline-lg text-center text-foreground">FAQ</h2>
                <div className="space-y-3 sm:space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="group rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm open:shadow-md transition-all"
                        >
                            <details className="list-none">
                                <summary className="flex items-center justify-between cursor-pointer list-none gap-4">
                                    <span className="text-sm sm:text-headline-sm text-card-foreground">{faq.q}</span>
                                    <div className="shrink-0">
                                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                                    </div>
                                </summary>
                                <p className="text-xs sm:text-body-sm text-muted-foreground mt-3 leading-relaxed border-t border-border pt-3">
                                    {faq.a}
                                </p>
                            </details>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
