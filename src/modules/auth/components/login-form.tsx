import { useState, type FormEvent } from 'react'
import { Loader2, LogIn } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'
import { useLogin } from '@/modules/auth/hooks/use-login'
import { Button } from '@/ui/button'

type Props = {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, error } = useLogin()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    mutate(
      { email: email.trim(), password },
      { onSuccess }
    )
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          required
          type="email"
          value={email}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
          id="password"
          minLength={1}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
          type="password"
          value={password}
        />
      </div>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {extractErrorMessage(error, 'Unable to sign in')}
        </p>
      ) : null}

      <Button className="w-full" disabled={isPending} size="lg" type="submit">
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            <LogIn />
            Sign in
          </>
        )}
      </Button>
    </form>
  )
}
