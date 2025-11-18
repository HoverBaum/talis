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

type PageTitleContextType = {
  title: string | null
  setTitle: (title: string | null) => void
}

const PageTitleContext = React.createContext<PageTitleContextType>({
  title: null,
  setTitle: () => {},
})

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = React.useState<string | null>(null)

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
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
 * - Import and render in page components: <SetPageTitle title="My Page" />
 * - Title will be displayed in the navbar via PageTitle component
 * - Automatically clears when component unmounts
 */
export function SetPageTitle({ title }: { title: string | null }) {
  const { setTitle } = usePageTitle()

  React.useEffect(() => {
    setTitle(title)
    return () => {
      setTitle(null)
    }
  }, [title, setTitle])

  return null
}

