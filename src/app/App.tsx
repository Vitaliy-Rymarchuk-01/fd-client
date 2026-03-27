import { Route, Routes } from 'react-router'

import { SignInPage } from '@/pages/auth/sign-in/SignInPage'
import { SignUpPage } from '@/pages/auth/sign-up/SignUpPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'

import { RequireAuth, RequireGuest, useSessionRestore } from '@/features/auth'

import { APP_ROUTES } from '@/shared/config/routes'

export function App() {
  useSessionRestore()

  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route path={APP_ROUTES.dashboard} element={<DashboardPage />} />
      </Route>

      <Route element={<RequireGuest />}>
        <Route path={APP_ROUTES.signIn} element={<SignInPage />} />
        <Route path={APP_ROUTES.signUp} element={<SignUpPage />} />
      </Route>
    </Routes>
  )
}

export default App
