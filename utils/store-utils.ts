'use client'

import { StateCreator } from 'zustand'
import { devtools, persist, type PersistStorage } from 'zustand/middleware'
import { z } from 'zod'
import { toast } from 'sonner'

/**
 * Registry of all storage names created via createStoreMiddleware.
 * This enables automatic discovery of all roller stores for operations
 * like cache clearing without hardcoding storage keys.
 */
const storageRegistry = new Set<string>()

/**
 * Gets all registered storage names.
 * @returns Array of all registered storage keys
 */
export function getAllRegisteredStorageNames(): string[] {
  return Array.from(storageRegistry)
}

/**
 * Converts our Migration array format to Zustand's migrate function.
 * Zustand's migrate receives (persistedState, version) where:
 * - persistedState is the persisted state (Partial<T>)
 * - version is the stored version number
 * Returns the migrated state (Partial<T>)
 */
function createZustandMigrate<T extends object>(
  migrations: Migration[],
  currentVersion: number
): (persistedState: unknown, version: number) => Partial<T> {
  return (persistedState: unknown, storedVersion: number): Partial<T> => {
    // If no migrations or already at current version, return state as-is
    if (migrations.length === 0 || storedVersion >= currentVersion) {
      return persistedState as Partial<T>
    }

    // Sort migrations by version to ensure correct order
    const sortedMigrations = [...migrations].sort((a, b) => a.version - b.version)

    // Apply migrations in order from stored version to current version
    let migratedState: unknown = persistedState
    for (const migration of sortedMigrations) {
      if (migration.version > storedVersion && migration.version <= currentVersion) {
        try {
          migratedState = migration.migrate(migratedState)
        } catch (error) {
          console.error(`Migration to version ${migration.version} failed:`, error)
          throw error
        }
      }
    }

    return migratedState as Partial<T>
  }
}

/**
 * Creates a custom storage adapter that handles schema validation.
 * Zustand's persist middleware handles versioning and migrations internally.
 * We intercept getItem to validate the state after Zustand's migration runs.
 */
function createValidatedStorage<T extends object>(
  schema: z.ZodType<Partial<T>>,
  displayName: string
): PersistStorage<Partial<T>> {
  return {
    getItem: (name: string) => {
      try {
        // Get stored state from localStorage
        const storedStateStr = localStorage.getItem(name)

        // If no stored data, return null to use defaults
        if (!storedStateStr) {
          return null
        }

        // Parse stored state
        let storedState: unknown
        try {
          storedState = JSON.parse(storedStateStr)
        } catch (error) {
          console.error(`[${displayName}] Failed to parse stored state:`, error)
          // Clear corrupted data
          localStorage.removeItem(name)
          // Show toast notification
          if (typeof window !== 'undefined') {
            toast.error('Roller settings reset due to data corruption', {
              description: `The ${displayName} settings were corrupted and have been reset to defaults.`,
            })
          }
          return null
        }

        // Zustand's persist middleware stores data as { state: {...}, version: 0 }
        // Extract the actual state from Zustand's format
        let stateToValidate: unknown = storedState
        if (
          typeof storedState === 'object' &&
          storedState !== null &&
          'state' in storedState &&
          typeof (storedState as { state: unknown }).state === 'object'
        ) {
          stateToValidate = (storedState as { state: unknown }).state
        }

        // Validate state against schema (migrations are handled by Zustand)
        const validationResult = schema.safeParse(stateToValidate)
        if (!validationResult.success) {
          console.error(`[${displayName}] Schema validation failed:`, validationResult.error)
          // Clear corrupted data
          localStorage.removeItem(name)
          // Show toast notification
          if (typeof window !== 'undefined') {
            toast.error('Roller settings reset due to validation failure', {
              description: `The ${displayName} settings were invalid and have been reset to defaults.`,
            })
          }
          return null
        }

        // Zustand's persist middleware expects getItem to return the state part
        // The version is handled separately by Zustand
        // Return just the validated state (cast to satisfy PersistStorage type)
        return validationResult.data as unknown as Partial<T> | null
      } catch (error) {
        console.error(`[${displayName}] Error loading stored state:`, error)
        // Clear potentially corrupted data
        localStorage.removeItem(name)
        // Show toast notification
        if (typeof window !== 'undefined') {
          toast.error('Roller settings reset due to error', {
            description: `An error occurred while loading ${displayName} settings. They have been reset to defaults.`,
          })
        }
        return null
      }
    },
    setItem: (name: string, value: unknown): void => {
      try {
        // Zustand's persist middleware passes { state: {...}, version: number }
        // We stringify it for localStorage
        const valueStr = typeof value === 'string' ? value : JSON.stringify(value)
        localStorage.setItem(name, valueStr)
      } catch (error) {
        console.error(`[${displayName}] Error saving state:`, error)
      }
    },
    removeItem: (name: string): void => {
      localStorage.removeItem(name)
    },
  } as PersistStorage<Partial<T>>
}

/**
 * Migration function that transforms state from one version to the next.
 * @param state - The state from the previous version (unknown type for safety)
 * @returns The migrated state (unknown type, will be validated by schema)
 */
export type MigrationFn = (state: unknown) => unknown

/**
 * Migration definition for a specific version.
 */
export interface Migration {
  /**
   * The target version this migration upgrades to.
   * Migrations are applied in order from stored version to current version.
   */
  version: number
  /**
   * Migration function that transforms state to the target version.
   */
  migrate: MigrationFn
}

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
    /**
     * Current version of the store schema. Must be incremented when schema changes.
     */
    version: number
    /**
     * Array of migrations to apply when stored version is older than current version.
     * Migrations are applied in order from stored version to current version.
     */
    migrations?: Migration[]
    /**
     * Zod schema to validate persisted state after migrations.
     * The schema should match the shape of the partialized state.
     */
    schema: z.ZodType<Partial<T>>
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
export function createStoreMiddleware<T extends object>(config: StoreConfig<T>): StateCreator<T> {
  const { stateCreator, persistConfig, devtoolsName } = config

  // Determine the DevTools name
  const name = devtoolsName || persistConfig?.name || 'Zustand Store'

  // If persistence is configured, wrap state creator with persist first
  if (persistConfig) {
    // Register the storage name in the registry
    storageRegistry.add(persistConfig.name)

    // Create validated storage adapter (validation happens after Zustand's migration)
    const validatedStorage = createValidatedStorage<T>(persistConfig.schema, name)

    // Convert our Migration[] format to Zustand's migrate function
    const migrate = persistConfig.migrations && persistConfig.migrations.length > 0
      ? createZustandMigrate<T>(persistConfig.migrations, persistConfig.version)
      : undefined

    const persistedMiddleware = persist<T, [], [], Partial<T>>(stateCreator, {
      name: persistConfig.name,
      version: persistConfig.version,
      ...(migrate && { migrate }),
      // Type assertion needed: our storage adapter works with localStorage strings
      // but Zustand's types expect StorageValue which is more permissive
      storage: validatedStorage as unknown as PersistStorage<Partial<T>>,
      ...(persistConfig.partialize && {
        partialize: persistConfig.partialize,
      }),
    })
    // Then wrap with devtools (devtools should be outermost to track all changes)
    // Type assertion needed due to Zustand's strict middleware typing
    const devtoolsMiddleware = devtools(persistedMiddleware, {
      name,
      enabled: process.env.NODE_ENV === 'development',
    })
    // Cast to StateCreator to satisfy create<T>()() type requirements
    return devtoolsMiddleware as unknown as StateCreator<T>
  }

  // If no persistence, just wrap with devtools
  const devtoolsMiddleware = devtools<T>(stateCreator, {
    name,
    enabled: process.env.NODE_ENV === 'development',
  })
  // Cast to StateCreator to satisfy create<T>()() type requirements
  return devtoolsMiddleware as unknown as StateCreator<T>
}

