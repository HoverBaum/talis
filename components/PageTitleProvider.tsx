'use client'

/**
 * PageTitleProvider Component
 * 
 * Provides a context for page titles to be set by individual pages.
 * 
 * Purpose:
 * - Enables decentralized title management where each page sets its own title
 * - Allows pages to control their navbar title independently
 * - Separates title logic from pathname-based routing
 * 
 * Usage:
 * - Wrap the app with PageTitleProvider
 * - Pages use SetPageTitle component to set their title
 * - PageTitle component reads from this context
 * 
 * Constraints:
 * - Must be a client component (uses React context)
 * - Pages should set their title using SetPageTitle component
 */
import * as React from 'react'
import type { IconName } from '@/lib/rollers'

type PageTitleContextType = {
  title: string | null
  iconName: IconName | null
  setTitle: (title: string | null, iconName?: IconName | null) => void
}

const PageTitleContext = React.createContext<PageTitleContextType>({
  title: null,
  iconName: null,
  setTitle: () => {},
})

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitleState] = React.useState<string | null>(null)
  const [iconName, setIconNameState] = React.useState<IconName | null>(null)

  const setTitle = React.useCallback((newTitle: string | null, newIconName?: IconName | null) => {
    setTitleState(newTitle)
    setIconNameState(newIconName ?? null)
  }, [])

  return (
    <PageTitleContext.Provider value={{ title, iconName, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  )
}

export function usePageTitle() {
  return React.useContext(PageTitleContext)
}

/**
 * SetPageTitle Component
 * 
 * Client component that pages can use to set their navbar title.
 * 
 * Usage:
 * - Import and render in page components: <SetPageTitle title="My Page" iconName="Dices" />
 * - Title will be displayed in the navbar via PageTitle component
 * - Automatically clears when component unmounts
 */
export function SetPageTitle({ title, iconName }: { title: string | null; iconName?: IconName | null }) {
  const { setTitle } = usePageTitle()

  React.useEffect(() => {
    setTitle(title, iconName)
    return () => {
      setTitle(null, null)
    }
  }, [title, iconName, setTitle])

  return null
}

