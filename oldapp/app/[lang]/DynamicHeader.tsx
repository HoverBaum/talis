'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { useHeader } from '@/components/header-context'

export const DynamicHeader = () => {
  const { title, actions } = useHeader()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background z-10">
      <SidebarTrigger />
      <div className="flex items-center flex-1">
        <span className="text-xl font-semibold">{title}</span>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
