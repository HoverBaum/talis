'use client'

import { store } from './store'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@/components/theme-provider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="talis-theme">
        {children}
      </ThemeProvider>
    </Provider>
  )
}
