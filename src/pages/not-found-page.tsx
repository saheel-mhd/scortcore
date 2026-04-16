import { Link } from 'react-router-dom'

import { routePaths } from '@/routes/paths'
import { usePageTitle } from '@/hooks/use-page-title'
import { PanelCard } from '@/shared/panel-card'
import { Button } from '@/ui/button'

function NotFoundPage() {
  usePageTitle('Not Found')

  return (
    <PanelCard
      description="The page you tried to open does not exist in the admin panel."
      title="Page not found"
    >
      <div className="flex flex-wrap gap-3">
        <Link to={routePaths.dashboard}>
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    </PanelCard>
  )
}

export default NotFoundPage
