"use client"

import { motion, HTMLMotionProps, Variants } from "framer-motion"
import { ReactNode, useMemo } from "react"

// Optimized transition that uses only transform and opacity
// to minimize forced reflow and layout thrashing
const OPTIMIZED_TRANSITION = {
    type: "spring" as const,
    stiffness: 260,
    damping: 20,
    mass: 0.8,
}

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    delay?: number
    duration?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    distance?: number
    staggerChildren?: number
    once?: boolean
    margin?: string
    scale?: number
    as?: any
}

export const MotionWrapper = ({
    children,
    delay = 0,
    duration = 0.6,
    direction = "up",
    distance = 30,
    staggerChildren,
    once = true,
    margin = "-80px",
    scale = 1,
    className,
    as: Component = motion.div,
    ...props
}: MotionWrapperProps) => {
    // If Component is a string (native HTML tag like "header", "section"), wrap it with motion()
    const MotionComponent = typeof Component === "string" ? motion(Component as any) : Component

    // Memoize variants to prevent unnecessary re-renders
    const variants: Variants = useMemo(() => ({
        hidden: {
            opacity: 0,
            x: direction === "left" ? -distance : direction === "right" ? distance : 0,
            y: direction === "up" ? distance : direction === "down" ? -distance : 0,
            scale: scale === 1 ? 1 : 0.95,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: {
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98],
                staggerChildren,
            },
        },
    }), [direction, distance, scale, duration, delay, staggerChildren])

    return (
        <MotionComponent
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin }}
            variants={variants}
            className={className}
            {...props}
        >
            {children}
        </MotionComponent>
    )
}

export const StaggerContainer = ({
    children,
    staggerDelay = 0.1,
    className,
    as: Component = motion.div,
    ...props
}: {
    children: ReactNode
    staggerDelay?: number
    className?: string
    as?: any
} & HTMLMotionProps<"div">) => {
    // If Component is a string (native HTML tag like "nav", "header"), wrap it with motion()
    // so motion props (whileInView, initial, etc.) are properly accepted
    const MotionComponent = typeof Component === "string" ? motion(Component as any) : Component

    // Memoize variants to prevent unnecessary re-renders
    const variants: Variants = useMemo(() => ({
        visible: {
            transition: {
                staggerChildren: staggerDelay,
            },
        },
    }), [staggerDelay])

    return (
        <MotionComponent
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={variants}
            className={className}
            {...props}
        >
            {children}
        </MotionComponent>
    )
}

// Optimized wrapper for static content that doesn't need animation
// Use this to wrap elements that were previously using MotionWrapper unnecessarily
export const StaticWrapper = ({
    children,
    className,
    as: Component = "div",
    ...props
}: {
    children: ReactNode
    className?: string
    as?: any
} & React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <Component className={className} {...props}>
            {children}
        </Component>
    )
}
