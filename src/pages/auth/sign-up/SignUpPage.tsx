import { Link } from 'react-router'

import { SignUpForm } from '@/features/auth/sign-up'
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
import { Separator } from '@/shared/components/ui/separator'

export function SignUpPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-x-0 top-[-20%] h-[520px] bg-[radial-gradient(80%_80%_at_50%_30%,hsl(var(--primary))_0%,transparent_55%)] opacity-20 blur-3xl" />
          <div className="bg-grid-mask absolute inset-0 opacity-30" />
          <div className="animate-aurora absolute -left-10 top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_top_left,hsl(var(--primary))/24%,transparent_65%)] blur-3xl" />
          <div className="animate-drift-slow absolute -right-10 bottom-0 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle_at_bottom_right,theme(colors.sky.300)/32%,transparent_60%)] blur-3xl" />
          <div className="animate-float-soft absolute right-10 top-16 hidden rounded-full border border-white/30 bg-white/50 px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-900 shadow-lg/40 backdrop-blur-md lg:flex">
            new release
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
                  Create your account
                </h1>
                <p className="mt-3 text-base text-muted-foreground">
                  A clean workspace for uploads, predictions, and reports.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border bg-card/70 p-5 shadow-sm shadow-slate-900/5 backdrop-blur">
                    <p className="text-sm font-medium text-muted-foreground">
                      What's inside
                    </p>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                          1
                        </span>
                        <div>
                          <p className="font-medium">Secure onboarding</p>
                          <p className="text-muted-foreground">Multi-step checks for every account.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                          2
                        </span>
                        <div>
                          <p className="font-medium">Unified theme</p>
                          <p className="text-muted-foreground">A cohesive look across dashboard tools.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                          3
                        </span>
                        <div>
                          <p className="font-medium">Realtime updates</p>
                          <p className="text-muted-foreground">Stay synced with model improvements.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
                    <span className="size-2 rounded-full bg-primary" />
                    <span>Launch-ready in minutes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md">
              <Card className="shadow-lg shadow-primary/5 animate-card-enter">
                <CardHeader>
                  <CardTitle>Sign up</CardTitle>
                  <CardDescription>
                    Create an account to start using the application.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <SignUpForm />

                  <div className="relative mt-5">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-card px-2 text-muted-foreground">
                        or
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="justify-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Button asChild variant="link" className="px-1">
                      <Link to={APP_ROUTES.signIn}>Sign in</Link>
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
