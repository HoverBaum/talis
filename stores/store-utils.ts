'use client'

import { StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

/**
 * Configuration options for creating a Zustand store with optional persistence
 * and automatic Redux DevTools integration.
 */
export interface StoreConfig<T> {
  /**
   * The state creator function that defines the store's initial state and actions.
   */
  stateCreator: StateCreator<T>
  /**
   * Optional persistence configuration. If provided, the store will be persisted
   * to localStorage with the specified name and partialize function.
   */
  persistConfig?: {
    name: string
    partialize?: (state: T) => Partial<T>
  }
  /**
   * Optional name for the store in Redux DevTools. Defaults to the persist name
   * if available, or 'Zustand Store' otherwise.
   */
  devtoolsName?: string
}

/**
 * Creates a middleware chain for Zustand stores with Redux DevTools support
 * and optional persistence.
 *
 * This utility function abstracts common store setup logic:
 * - Automatically enables Redux DevTools in development
 * - Optionally adds persistence middleware
 * - Provides consistent store creation across the application
 *
 * The middleware order is: devtools wraps persist (if configured), which wraps
 * the state creator. This ensures DevTools can track all state changes including
 * persistence operations.
 *
 * @param config - Store configuration including state creator and optional persistence
 * @returns A middleware chain that can be passed to Zustand's `create()` function
 *
 * @example
 * ```ts
 * // Store without persistence
 * export const useMyStore = create<MyState>()(
 *   createStoreMiddleware({
 *     stateCreator: (set) => ({
 *       count: 0,
 *       increment: () => set((state) => ({ count: state.count + 1 })),
 *     }),
 *     devtoolsName: 'MyStore',
 *   })
 * )
 *
 * @example
 * ```ts
 * // Store with persistence
 * export const useMyStore = create<MyState>()(
 *   createStoreMiddleware({
 *     stateCreator: (set) => ({
 *       count: 0,
 *       increment: () => set((state) => ({ count: state.count + 1 })),
 *     }),
 *     persistConfig: {
 *       name: 'my-store-storage',
 *       partialize: (state) => ({ count: state.count }),
 *     },
 *   })
 * )
 * ```
 */
export function createStoreMiddleware<T extends object>(config: StoreConfig<T>) {
  const { stateCreator, persistConfig, devtoolsName } = config

  // Determine the DevTools name
  const name = devtoolsName || persistConfig?.name || 'Zustand Store'

  // If persistence is configured, wrap state creator with persist first
  let middleware = persistConfig
    ? persist<T, [], [], Partial<T>>(stateCreator, {
        name: persistConfig.name,
        ...(persistConfig.partialize && {
          partialize: persistConfig.partialize,
        }),
      })
    : stateCreator

  // Then wrap with devtools (devtools should be outermost to track all changes)
  return devtools<T>(middleware, {
    name,
    enabled: process.env.NODE_ENV === 'development',
  })
}

