"use client"

import React, { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Activity } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { MotionWrapper, StaggerContainer } from "@/components/motion-wrapper"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callbackUrl = searchParams.get("callbackUrl") || "/tenants"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Invalid email or password")
        toast.error("Invalid email or password")
        setLoading(false)
      } else {
        toast.success("Successfully logged in!")
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
      toast.error("An unexpected error occurred.")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm md:max-w-md border-outline bg-surface shadow-elevation-3 backdrop-blur-xl">
      <CardHeader className="flex flex-col items-center pb-6">
        <MotionWrapper delay={0.1} transition={{ type: "spring" }}>
          <div className="h-16 flex items-center px-6  gap-3">
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-card/30 !bg-[#0E1511]">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#4EDEA3] text-black">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="font-heading font-bold tracking-tight text-[#4EDEA3] text-lg">AInsurance</span>
              </Link>
            </div>
          </div>
        </MotionWrapper>
        <CardTitle className="text-headline-sm font-heading text-on-surface">Welcome Back</CardTitle>
        <CardDescription className="text-on-surface-variant">Sign in to manage your configuration platform</CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <MotionWrapper className="p-3 mb-6 text-sm text-error-container-foreground bg-error-container/20 border border-error/20 rounded-md">
            {error}
          </MotionWrapper>
        )}

        <form onSubmit={handleSubmit}>
          <StaggerContainer className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-on-surface-variant">
                  <Mail className="w-4 h-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background border-outline focus-visible:ring-primary text-on-surface placeholder:text-on-surface-variant"
                  placeholder="operator@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-on-surface-variant">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-background border-outline focus-visible:ring-primary text-on-surface placeholder:text-on-surface-variant"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-container text-primary-foreground shadow-lg shadow-primary/10 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </StaggerContainer>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-outline pt-6 mt-2 bg-surface">
        <div className="text-label-sm text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-primary-container font-semibold transition-colors">
            Sign up now
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 md:p-8 relative">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      {/* Decorative accent blur */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center text-on-surface-variant">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <p className="text-label-sm">Loading login form...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
