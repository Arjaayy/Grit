import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface LoginFormProps extends React.ComponentProps<"div"> {
  email?: string
  setEmail?: (value: string) => void
  password?: string
  setPassword?: (value: string) => void
  handleSubmit?: (e: React.FormEvent) => void
  loading?: boolean
  error?: string
}

export function LoginForm({
  className,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  loading,
  error,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-2xl bg-card text-card-foreground">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col justify-center bg-card">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Portal</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to access the dashboard
                </p>
              </div>

              {error && (
                <div className="bg-destructive/15 text-destructive text-xs p-3 rounded-md border border-destructive/20 mb-4">
                  {error}
                </div>
              )}

              <div className="grid gap-4">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gritdigitalperformance.com"
                    required
                    value={email}
                    onChange={(e) => setEmail?.(e.target.value)}
                    className="h-11"
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword?.(e.target.value)}
                    className="h-11"
                  />
                </Field>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-[#e8192c] hover:bg-[#c11525] text-white transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Demo Credentials</p>
                <div className="bg-muted/30 dark:bg-muted/10 p-3 rounded-lg text-xs space-y-1 border border-border/50">
                  <p><span className="text-muted-foreground">Email:</span> <code className="font-mono text-foreground/90">admin@gritdigitalperformance.com</code></p>
                  <p><span className="text-muted-foreground">Pass:</span> <code className="font-mono text-foreground/90">admin123</code></p>
                </div>
              </div>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block min-h-[500px]">
            <Image
              src="/duterts.png"
              alt="Grit Digital Performance"
              fill
              className="absolute inset-0 object-cover brightness-[0.7] contrast-[1.1] dark:brightness-[0.5] dark:contrast-[1.2]"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-lg font-bold">Grit Digital Performance</p>
              <p className="text-sm opacity-80 text-balance">Enterprise Grade Performance Analytics & Event Management</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground px-6">
        Secure Admin Access. Authorized personnel only.
      </p>
    </div>
  )
}
