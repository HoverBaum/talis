'use client'

import { useSyncExternalStore } from 'react'

type PersistApi = {
  hasHydrated: () => boolean
  onFinishHydration: (cb: () => void) => () => void
}

const subscribeNoop = () => () => {}
const getServerSnapshot = () => false
const getDefaultClientSnapshot = () => true

/**
 * Supports both persisted and non-persisted stores. Non-persisted stores are
 * considered hydrated immediately on the client.
 */
export function useHasHydrated<TStore extends object>(
  store: TStore & { persist?: PersistApi }
): boolean {
  const persist = store.persist

  return useSyncExternalStore(
    persist ? persist.onFinishHydration : subscribeNoop,
    persist ? persist.hasHydrated : getDefaultClientSnapshot,
    getServerSnapshot
  )
}
