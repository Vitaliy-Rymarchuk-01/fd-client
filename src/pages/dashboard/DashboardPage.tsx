import { StageChart } from '@/features/stage-chart'

import { DashboardLayout } from './layout/DashboardLayout'

export function DashboardPage() {
  return (
    <DashboardLayout>
      <StageChart />
    </DashboardLayout>
  )
}
