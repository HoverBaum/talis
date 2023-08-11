'use client'

import { store } from './store'
import { Provider } from 'react-redux'
import { useEffect } from 'react'
import { themeChange } from 'theme-change'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    themeChange(false)
    // 👆 false parameter is required for react project
  }, [])
  return <Provider store={store}>{children}</Provider>
}
