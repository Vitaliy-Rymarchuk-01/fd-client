import { Link } from 'react-router'

import { APP_ROUTES } from '@/shared/config/routes'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Separator } from '@/shared/components/ui/separator'

export function SignInPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_0%,hsl(var(--primary))_0%,transparent_55%)] opacity-15" />
          <div className="bg-grid-mask absolute inset-0 opacity-30" />
          <div className="animate-aurora absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,hsl(var(--primary))/28%,transparent_65%)] blur-3xl" />
          <div className="animate-drift-slow absolute bottom-[-15%] right-[-5%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_bottom_left,theme(colors.emerald.300)/30%,transparent_60%)] blur-3xl" />
          <div className="animate-float-soft absolute left-6 top-16 hidden rounded-full border border-white/30 bg-white/40 px-5 py-2 text-sm font-medium text-slate-900 shadow-lg/40 backdrop-blur-md lg:flex">
            Seamless predictions
          </div>
        </div>
        <div className="mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-4 py-10">
          <div className="grid w-full items-center gap-10 lg:grid-cols-2">
            <div className="hidden lg:block">
              <div className="max-w-md">
                <p className="text-sm font-medium text-muted-foreground">
                  Fracture detection
                </p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                  Welcome back
                </h1>
                <p className="mt-3 text-base text-muted-foreground">
                  Sign in to continue working with your cases and predictions.
                </p>
                <div className="mt-8 grid gap-4">
                  <div className="rounded-2xl border bg-card/60 p-5 shadow-sm shadow-primary/5 backdrop-blur">
                    <p className="text-sm font-medium text-muted-foreground">
                      Tip
                    </p>
                    <p className="mt-1 text-sm">
                      Use a strong password and keep your session secure.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl border bg-card/80 px-4 py-3 shadow-sm shadow-slate-900/5">
                      <p className="text-sm font-semibold">95%</p>
                      <p className="text-xs text-muted-foreground">Detection rate</p>
                    </div>
                    <div className="rounded-2xl border bg-card/80 px-4 py-3 shadow-sm shadow-slate-900/5">
                      <p className="text-sm font-semibold">24/7</p>
                      <p className="text-xs text-muted-foreground">Access</p>
                    </div>
                    <div className="rounded-2xl border bg-card/80 px-4 py-3 shadow-sm shadow-slate-900/5">
                      <p className="text-sm font-semibold">Secure</p>
                      <p className="text-xs text-muted-foreground">TLS 1.3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md">
              <Card className="shadow-lg shadow-primary/5 animate-card-enter">
                <CardHeader>
                  <CardTitle>Sign in</CardTitle>
                  <CardDescription>
                    Enter your email and password to access your account.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form className="grid gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button
                          variant="link"
                          size="xs"
                          className="h-auto px-0 text-muted-foreground"
                          type="button"
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                    </div>

                    <Button className="w-full" type="button">
                      Sign in
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-2 text-muted-foreground">
                          or
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full transition-transform duration-300 hover:-translate-y-0.5"
                      variant="outline"
                      type="button"
                    >
                      Continue with Google
                    </Button>
                  </form>
                </CardContent>

                <CardFooter className="justify-center">
                  <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Button asChild variant="link" className="px-1">
                      <Link to={APP_ROUTES.signUp}>Sign up</Link>
                    </Button>
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
