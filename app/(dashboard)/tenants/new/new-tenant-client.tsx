"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TenantForm } from "../tenant-form"
import { TenantConfig } from "@/lib/tenant-schema"
import { toast } from "sonner"

export default function NewTenantClient() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (config: TenantConfig, name: string, slug: string) => {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/tenants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, slug, config }),
            })

            if (!response.ok) {
                toast.error("Failed to create tenant")
                return
            }

            const data = await response.json()
            toast.success("Tenant created successfully")
            router.push(`/tenants/${data.id}`)
            router.refresh()
        } catch (error) {
            console.error("Error creating tenant:", error)
            toast.error("Failed to create tenant")
        } finally {
            setIsSubmitting(false)
        }
    }

    return <TenantForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
}