"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, Activity } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { MotionWrapper } from "@/components/motion-wrapper"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("operator")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setSuccess(true)
      toast.success("Account created successfully!")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create account. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 md:p-8 relative">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      {/* Decorative accent blur */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

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
          <CardTitle className="text-headline-sm font-heading text-primary">Create Account</CardTitle>
          <CardDescription className="text-on-surface-variant">Register as a system operator or admin</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="p-3 mb-6 text-sm text-error-container-foreground bg-error-container/20 border border-error/20 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 mb-6 text-sm text-secondary bg-secondary-container/20 border border-secondary/20 rounded-md">
              Account created successfully! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                Full Name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-on-surface-variant">
                  <User className="w-4 h-4" />
                </div>
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-background border-outline focus-visible:ring-primary text-primary placeholder:text-on-surface-variant"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  className="pl-10 bg-background border-outline focus-visible:ring-primary text-primary placeholder:text-on-surface-variant"
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
                  className="pl-10 pr-10 bg-background border-outline focus-visible:ring-primary text-primary placeholder:text-on-surface-variant"
                  placeholder="•••••••• (Min 6 chars)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant hover:text-primary cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                Role
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRole("operator")}
                  className={`py-6 border transition-all cursor-pointer ${role === "operator"
                    ? "bg-surface hover:bg-surface-container border-primary text-primary shadow-lg shadow-primary/10"
                    : "bg-background border-outline text-on-surface-variant hover:text-primary hover:bg-surface-container"
                    }`}
                >
                  Operator
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRole("admin")}
                  className={`py-6 border transition-all cursor-pointer ${role === "admin"
                    ? "bg-surface hover:bg-surface-container border-primary text-primary shadow-lg shadow-primary/10"
                    : "bg-background border-outline text-on-surface-variant hover:text-primary hover:bg-surface-container"
                    }`}
                >
                  Admin
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || success}
              className="w-full bg-primary hover:bg-primary-container text-primary-foreground shadow-lg shadow-primary/10 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Register Account <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-outline pt-6 mt-2 bg-surface">
          <div className="text-label-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary-container font-semibold transition-colors">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
