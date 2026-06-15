import { Activity } from "lucide-react"
import { footerProductLinks, footerCompanyLinks } from "../data"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-card border-t border-border py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:gap-8">
                <div>
                    <Link href="/" className="flex items-center gap-2 mb-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-[#4EDEA3] text-black">
                            <Activity className="w-4 h-4" />
                        </div>
                        <span className="font-heading font-bold text-foreground text-sm sm:text-base">
                            AInsurance
                        </span>
                    </Link>
                    <p className="text-xs sm:text-label-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} AInsurance Platform. All rights reserved.
                    </p>
                </div>

                <div className="flex gap-8 sm:gap-12 text-xs sm:text-body-sm">
                    <div className="space-y-2">
                        <span className="text-foreground font-semibold block">Product</span>
                        {footerProductLinks.map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-muted-foreground hover:text-foreground block transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <span className="text-foreground font-semibold block">Company</span>
                        {footerCompanyLinks.map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-muted-foreground hover:text-foreground block transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
