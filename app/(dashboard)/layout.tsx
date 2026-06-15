"use server"

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamic import for the client layout component
const DashboardLayoutClient = dynamic(() => import("@/components/DashboardLayoutClient"), {
  loading: () => <LayoutSkeleton />,
  ssr: true
})

// Skeleton component for loading state
function LayoutSkeleton() {
  return (
    <div className="flex h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-64 bg-card/50 border-r border-border/80 flex-col">
        <div className="h-16 border-b border-border/80 px-6 flex items-center">
          <div className="animate-pulse h-8 w-32 bg-muted rounded" />
        </div>
        <div className="flex-1 px-4 py-6 space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-12 bg-muted rounded" />
          ))}
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-border/80 bg-card/30" />
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-64" />
            <div className="h-4 bg-muted rounded w-96" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <DashboardLayoutClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    >
      {children}
    </DashboardLayoutClient>
  );
}
