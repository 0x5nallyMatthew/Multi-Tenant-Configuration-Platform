import React from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import NewTenantClient from "./new-tenant-client"

export default async function NewTenantPage() {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  return <NewTenantClient />
}
