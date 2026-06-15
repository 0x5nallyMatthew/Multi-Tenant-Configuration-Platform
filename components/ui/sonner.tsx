"use client"

import { CheckCircle, InfoIcon, LoaderCircle, TriangleAlert, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

/**
 * Material Symbols icon components for toast notifications.
 * Uses filled variants for success, error, and warning icons.
 */
const IconSuccess = () => (
  <span
    className="material-symbols-outlined text-[18px]"
    style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}
  >
    <CheckCircle className="h-4 w-4" />
  </span>
)

const IconError = () => (
  <span
    className="material-symbols-outlined text-[18px]"
    style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}
  >
    <X className="h-4 w-4" />
  </span>
)

const IconWarning = () => (
  <span
    className="material-symbols-outlined text-[18px]"
    style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}
  >
    <TriangleAlert className="h-4 w-4" />
  </span>
)

const IconInfo = () => (
  <span
    className="material-symbols-outlined text-[18px]"
    style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
  >
    <InfoIcon className="h-4 w-4" />
  </span>
)

const IconLoading = () => (
  <span className="material-symbols-outlined text-[18px] animate-spin">
    <LoaderCircle className="h-4 w-4" />
  </span>
)

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      icons={{
        success: <IconSuccess />,
        info: <IconInfo />,
        warning: <IconWarning />,
        error: <IconError />,
        loading: <IconLoading />,
      }}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: [
            // Base styles matching TOAST.html
            "group toast",
            "group-[.toaster]:bg-white",
            "group-[.toaster]:text-primary",
            "group-[.toaster]:border",
            "group-[.toaster]:border-outline-variant/50",
            "group-[.toaster]:rounded-xl",
            "group-[.toaster]:p-4",
            "group-[.toaster]:shadow-[0_4px_12px_rgba(15,23,42,0.05)]",
            "group-[.toaster]:max-w-md",
            "group-[.toaster]:w-full",
            // Animation
            "group-[.toaster]:transition-all",
            "group-[.toaster]:duration-300",
          ].join(" "),
          // Icon container styling
          icon: [
            "group-[.toast]:flex-shrink-0",
            "group-[.toast]:w-10",
            "group-[.toast]:h-10",
            "group-[.toast]:rounded-lg",
            "group-[.toast]:flex",
            "group-[.toast]:items-center",
            "group-[.toast]:justify-center",
          ].join(" "),
          description: "group-[.toast]:text-on-surface-variant",
          actionButton: [
            "group-[.toast]:bg-primary",
            "group-[.toast]:text-on-primary",
            "group-[.toast]:rounded-lg",
            "group-[.toast]:px-3",
            "group-[.toast]:py-1.5",
            "group-[.toast]:text-sm",
            "group-[.toast]:font-medium",
          ].join(" "),
          cancelButton: [
            "group-[.toast]:bg-surface-container",
            "group-[.toast]:text-on-surface-variant",
            "group-[.toast]:rounded-lg",
            "group-[.toast]:px-3",
            "group-[.toast]:py-1.5",
            "group-[.toast]:text-sm",
          ].join(" "),
          // Success: Secondary (emerald) with left accent - matching TOAST.html
          success: [
            "group-[.toaster]:!border-secondary-container/20",
            "group-[.toaster]:!border-l-4",
            "group-[.toaster]:!border-l-secondary",
            // Icon container
            "group-[.toast]:[&>div:first-child]:!bg-secondary-container/10",
            "group-[.toast]:[&>div:first-child]:!text-secondary",
            "group-[.toast]:[&>div:first-child]:!w-10",
            "group-[.toast]:[&>div:first-child]:!h-10",
            "group-[.toast]:[&>div:first-child]:!rounded-lg",
          ].join(" "),
          // Error: Error (red) with left accent - matching TOAST.html
          error: [
            "group-[.toaster]:!border-error-container/20",
            "group-[.toaster]:!border-l-4",
            "group-[.toaster]:!border-l-error",
            // Icon container
            "group-[.toast]:[&>div:first-child]:!bg-error-container/10",
            "group-[.toast]:[&>div:first-child]:!text-error",
            "group-[.toast]:[&>div:first-child]:!w-10",
            "group-[.toast]:[&>div:first-child]:!h-10",
            "group-[.toast]:[&>div:first-child]:!rounded-lg",
          ].join(" "),
          // Warning: Warning (amber) with left accent - matching TOAST.html
          warning: [
            "group-[.toaster]:!border-warning/20",
            "group-[.toaster]:!border-l-4",
            "group-[.toaster]:!border-l-warning",
            // Icon container
            "group-[.toast]:[&>div:first-child]:!bg-warning/10",
            "group-[.toast]:[&>div:first-child]:!text-warning",
            "group-[.toast]:[&>div:first-child]:!w-10",
            "group-[.toast]:[&>div:first-child]:!h-10",
            "group-[.toast]:[&>div:first-child]:!rounded-lg",
          ].join(" "),
          // Info: Surface container high - matching TOAST.html
          info: [
            "group-[.toaster]:!bg-white",
            "group-[.toaster]:!border-outline-variant/50",
            // Icon container
            "group-[.toast]:[&>div:first-child]:!bg-surface-container-high",
            "group-[.toast]:[&>div:first-child]:!text-primary",
            "group-[.toast]:[&>div:first-child]:!w-10",
            "group-[.toast]:[&>div:first-child]:!h-10",
            "group-[.toast]:[&>div:first-child]:!rounded-lg",
          ].join(" "),
          // Close button styling
          closeButton: [
            "group-[.toast]:!absolute",
            "group-[.toast]:!right-3",
            "group-[.toast]:!top-3",
            "group-[.toast]:!text-outline",
            "group-[.toast]:!hover:text-primary",
            "group-[.toast]:!border-none",
            "group-[.toast]:!bg-transparent",
          ].join(" "),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
