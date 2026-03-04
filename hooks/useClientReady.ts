'use client'

import { useSyncExternalStore } from 'react'

/**
 * Returns false during SSR and true on the client without effect-driven state updates.
 */
export function useClientReady(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}
