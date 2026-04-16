import { useEffect } from 'react'

const appName = 'ScortCore CRM'

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${appName}`
  }, [title])
}
