import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { APP_ROUTES } from '@/shared/config/routes'

import { useSignUpMutation } from '../hooks/use-sign-up-mutation'
import { signUpSchema, type SignUpFormValues } from '../types/schema'

export function SignUpForm() {
  const navigate = useNavigate()
  const signUpMutation = useSignUpMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    signUpMutation.mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          navigate(APP_ROUTES.dashboard)
        },
      },
    )
  })

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          {...register('name')}
        />
        {errors.name?.message ? (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

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
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />
        {errors.password?.message ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword?.message ? (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        ) : null}
      </div>

      {signUpMutation.error?.message ? (
        <p className="text-sm text-destructive">{signUpMutation.error.message}</p>
      ) : null}

      <Button className="w-full" type="submit" disabled={signUpMutation.isPending}>
        Create account
      </Button>

      <Button
        className="w-full transition-transform duration-300 hover:-translate-y-0.5"
        variant="outline"
        type="button"
        disabled={signUpMutation.isPending}
      >
        Sign up with Google
      </Button>
    </form>
  )
}
