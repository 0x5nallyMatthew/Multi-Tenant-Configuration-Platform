"use client"

import { useState, useEffect, useCallback } from "react"
import { BarChart3, Shield, Zap } from "lucide-react"

const heroSlides = [
    { icon: BarChart3, title: "Real-Time Dashboard", subtitle: "Live claims processing & analytics" },
    { icon: Shield, title: "Enterprise Security", subtitle: "SOC 2 Type II certified infrastructure" },
    { icon: Zap, title: "Instant Deployments", subtitle: "Zero-downtime tenant configuration rollout" },
]

const SLIDE_INTERVAL = 2000

export function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, [])

    useEffect(() => {
        if (isPaused) return

        const interval = setInterval(nextSlide, SLIDE_INTERVAL)
        return () => clearInterval(interval)
    }, [isPaused, nextSlide])

    return (
        <div
            className="rounded-2xl border border-border bg-muted aspect-[4/3] relative overflow-hidden shadow-lg"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />

            {/* Slides */}
            <div className="absolute inset-0 flex items-center justify-center">
                {heroSlides.map((slide, index) => {
                    const Icon = slide.icon
                    const isActive = index === currentSlide

                    return (
                        <div
                            key={index}
                            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${isActive
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-4 pointer-events-none"
                                }`}
                        >
                            <div className="text-center p-4 sm:p-6 space-y-2 sm:space-y-3">
                                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 mx-auto">
                                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                                </div>
                                <p className="text-xs sm:text-sm font-semibold text-foreground">
                                    {slide.title}
                                </p>
                                <p className="text-[10px] sm:text-xs uppercase tracking-wider font-mono text-muted-foreground">
                                    {slide.subtitle}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${index === currentSlide
                            ? "bg-primary w-4 sm:w-6"
                            : "bg-border w-1.5 sm:w-2 hover:bg-border/80"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
