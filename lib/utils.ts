import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date)
}

export function calculateSlaDeadline(submittedAt: string, businessDays: number) {
  const date = new Date(submittedAt)
  let daysAdded = 0
  while (daysAdded < businessDays) {
    date.setDate(date.getDate() + 1)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      daysAdded++
    }
  }
  return date.toISOString().split("T")[0]
}
