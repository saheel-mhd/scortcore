import { useMutation } from '@tanstack/react-query'

import { login } from '@/modules/auth/api/login'
import type { LoginInput, LoginResponse } from '@/modules/auth/types/auth.types'
import { useAuthStore } from '@/store/auth-store'

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: login,
    onSuccess: ({ user, token }) => {
      setSession({ accessToken: token, user })
    },
  })
}
