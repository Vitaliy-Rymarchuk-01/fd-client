import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

export function DashboardPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16">
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Overview</p>
          <h1 className="text-4xl font-semibold tracking-tight">Dashboard placeholder</h1>
          <p className="text-base text-muted-foreground">
            This screen will soon show live case statistics, detection timelines, and model status.
            For now, use it as a quick entry point into the platform.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button>Primary action</Button>
            <Button variant="outline">Secondary</Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Pending studies', value: '12 cases' },
            { label: 'Avg. analysis time', value: '2m 14s' },
            { label: 'Last sync', value: 'Just now' },
          ].map((item) => (
            <Card key={item.label} className="bg-card/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="rounded-3xl border border-dashed p-8 text-center text-muted-foreground">
          <p className="font-medium">Coming soon</p>
          <p className="mt-2 text-sm">
            Insights, case timelines, and collaboration notes will live here. Hook up your data sources to
            populate the dashboard once backend endpoints are ready.
          </p>
        </section>
      </div>
    </div>
  )
}
