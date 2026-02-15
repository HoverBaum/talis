'use client'

import { useSyncExternalStore } from 'react'

export type StoreWithPersist = {
  persist: {
    hasHydrated: () => boolean
    onFinishHydration: (cb: () => void) => () => void
  }
}

/**
 * Returns true once the persisted store has finished rehydrating from storage.
 * Use this to avoid flicker when rendering config that depends on persisted state
 * (e.g. switches that show default value before rehydration completes).
 *
 * @param store - A Zustand store created with persist middleware
 * @returns true when hydration is complete, false while loading
 */
export function useHasHydrated(store: StoreWithPersist): boolean {
  return useSyncExternalStore(
    (onStoreChange) => store.persist.onFinishHydration(onStoreChange),
    () => store.persist.hasHydrated(),
    () => false
  )
}
