'use client'

import { useEffect } from 'react'
import { useHasHydrated } from './useStoreHydration'
import { isIOSDevice } from '@/lib/device'
import { useSettingsStore } from '@/app/[locale]/pages/settings/settings-store'

export function useIOSNavigation() {
  const hasHydrated = useHasHydrated(useSettingsStore)
  const iosNavigationEnabled = useSettingsStore(
    (state) => state.iosNavigationEnabled
  )
  const initializeIosNavigationEnabled = useSettingsStore(
    (state) => state.initializeIosNavigationEnabled
  )

  useEffect(() => {
    if (!hasHydrated || typeof iosNavigationEnabled !== 'undefined') {
      return
    }

    initializeIosNavigationEnabled(isIOSDevice())
  }, [hasHydrated, iosNavigationEnabled, initializeIosNavigationEnabled])

  return {
    isIOSNavigationEnabled: iosNavigationEnabled ?? false,
    isResolved: hasHydrated && typeof iosNavigationEnabled !== 'undefined',
  }
}
