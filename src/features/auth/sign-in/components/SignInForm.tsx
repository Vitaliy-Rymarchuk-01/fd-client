import { useNavigate } from 'react-router'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'sonner'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { APP_ROUTES } from '@/shared/config/routes'

import { useSignInMutation } from '../hooks/use-sign-in-mutation'
import { type SignInFormValues, signInSchema } from '../types/schema'

export function SignInForm() {
  const navigate = useNavigate()

  const signInMutation = useSignInMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    signInMutation.mutate(values, {
      onSuccess: () => {
        navigate(APP_ROUTES.dashboard)
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to sign in')
      },
    })
  })

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email?.message ? (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />
        {errors.password?.message ? (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        ) : null}
      </div>

      <Button
        className="w-full"
        type="submit"
        disabled={signInMutation.isPending}
      >
        Sign in
      </Button>

      <Button
        className="w-full transition-transform duration-300 hover:-translate-y-0.5"
        variant="outline"
        type="button"
        disabled={signInMutation.isPending}
      >
        Continue with Google
      </Button>
    </form>
  )
}
