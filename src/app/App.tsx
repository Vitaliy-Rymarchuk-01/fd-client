import { Route, Routes } from 'react-router'

import { SignInPage } from '@/pages/auth/sign-in/SignInPage'
import { SignUpPage } from '@/pages/auth/sign-up/SignUpPage'
import { APP_ROUTES } from '@/shared/config/routes'

const DashboardPage = () => <p>Dashboard</p>

export function App() {
  return (
    <Routes>
      <Route path={APP_ROUTES.dashboard} element={<DashboardPage />} />
      <Route path={APP_ROUTES.signIn} element={<SignInPage />} />
      <Route path={APP_ROUTES.signUp} element={<SignUpPage />} />
    </Routes>
  )
}

export default App