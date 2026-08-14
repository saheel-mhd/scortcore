import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { apiClient, type ApiEnvelope } from '@/api/client'
import type { AuthSession, AuthStatus, AuthUser } from '@/types/auth'

type AuthStore = {
  accessToken: string | null
  hasHydrated: boolean
  status: AuthStatus
  user: AuthUser | null
  setSession: (session: AuthSession | null) => void
  signOut: () => void
  setHasHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      hasHydrated: false,
      status: 'anonymous',
      user: null,
      setSession: (session) => {
        if (!session) {
          set({ accessToken: null, status: 'anonymous', user: null })
          return
        }

        set({
          accessToken: session.accessToken,
          status: 'authenticated',
          user: session.user,
        })
      },
      signOut: () => {
        set({ accessToken: null, status: 'anonymous', user: null })
      },
      setHasHydrated: (value) => {
        set({ hasHydrated: value })
      },
    }),
    {
      name: 'crm-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        status: state.status,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)

        if (state?.accessToken && state.status === 'authenticated') {
          apiClient
            .get<ApiEnvelope<AuthUser>>('/auth/me')
            .then((response) => {
              state.setSession({
                accessToken: state.accessToken!,
                user: response.data.data,
              })
            })
            .catch(() => {})
        }
      },
    }
  )
)
