"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TenantForm } from "../tenant-form"
import { TenantConfig } from "@/lib/tenant-schema"

interface EditTenantClientProps {
    tenant: {
        id: string
        name: string
        slug: string
        config: TenantConfig
    }
}

export default function EditTenantClient({ tenant }: EditTenantClientProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (config: TenantConfig, name: string, slug: string) => {
        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/tenants/${tenant.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, slug, config }),
            })

            if (!response.ok) {
                throw new Error("Failed to update tenant")
            }

            router.push("/tenants")
            router.refresh()
        } catch (error) {
            console.error("Error updating tenant:", error)
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <TenantForm
            initialData={tenant}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEdit={true}
        />
    )
}