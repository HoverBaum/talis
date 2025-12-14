'use client'

import { create } from 'zustand'
import { z } from 'zod'
import { createStoreMiddleware } from '@/utils/store-utils'
import {
  type PolyhedralRollResult,
  type PolyhedralDiceType,
} from '../polyhedral/polyhedral-store'

export type DaggerheartRoll = {
  hope: number
  fear: number
  timestamp: number
  id: string
  type: 'Daggerheart'
}

export type DaggerheartRollResult = DaggerheartRoll | PolyhedralRollResult

const DEFAULT_DICE_TYPES: PolyhedralDiceType[] = [4, 6, 8, 10, 12, 20, 100]
const DEFAULT_MAX_QUANTITY = 8

export type RollMode = 'daggerheart' | 'polyhedral'

/**
 * Schema for persisted state (matches partialize output).
 * This is the single source of truth for the persisted state structure.
 */
const persistedStateSchema = z.object({
  config: z.object({
    useThemeColors: z.boolean(),
    enabledDice: z.array(z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10), z.literal(12), z.literal(20), z.literal(100)])),
    diceSettings: z.record(
      z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10), z.literal(12), z.literal(20), z.literal(100)]),
      z.object({
        maxQuantity: z.number().min(1).max(100),
      })
    ),
  }),
  rollMode: z.union([z.literal('daggerheart'), z.literal('polyhedral')]),
  selectedDiceType: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10), z.literal(12), z.literal(20), z.literal(100)]),
  diceQuantities: z.record(z.number(), z.number()),
})

/**
 * Type derived from schema - ensures type safety matches validation.
 * This is the single source of truth for persisted state structure.
 */
export type PersistedDaggerheartState = z.infer<typeof persistedStateSchema>

/**
 * Config type derived from schema - ensures type safety matches validation.
 * This is the single source of truth for config structure.
 */
export type DaggerheartConfigType = PersistedDaggerheartState['config']

const DEFAULT_CONFIG: DaggerheartConfigType = {
  useThemeColors: false,
  enabledDice: DEFAULT_DICE_TYPES,
  diceSettings: DEFAULT_DICE_TYPES.reduce(
    (acc, diceType) => {
      acc[diceType] = { maxQuantity: DEFAULT_MAX_QUANTITY }
      return acc
    },
    {} as Record<number, { maxQuantity: number }>
  ),
}

export interface DaggerheartState extends PersistedDaggerheartState {
  config: DaggerheartConfigType
  rollMode: RollMode
  selectedDiceType: PolyhedralDiceType
  diceQuantities: Record<number, number>
  rolls: DaggerheartRollResult[]
  clearRolls: () => void
  addRoll: (roll: DaggerheartRollResult) => void
  updateConfig: (config: Partial<DaggerheartConfigType>) => void
  setRollMode: (mode: RollMode) => void
  setSelectedDiceType: (diceType: PolyhedralDiceType) => void
  setDiceQuantity: (diceType: number, quantity: number) => void
  toggleDiceType: (diceType: PolyhedralDiceType) => void
  setMaxQuantityForDice: (diceType: PolyhedralDiceType, maxQuantity: number) => void
}

export const useDaggerheartStore = create<DaggerheartState>()(
  createStoreMiddleware<DaggerheartState>({
    stateCreator: (set, get) => ({
      rolls: [],
      config: DEFAULT_CONFIG,
      rollMode: 'daggerheart' as RollMode,
      selectedDiceType: 6,
      diceQuantities: {},
      clearRolls: () => set({ rolls: [] }),
      addRoll: (roll) =>
        set((state) => ({
          rolls: [...state.rolls, roll],
        })),
      setRollMode: (mode: RollMode) => set({ rollMode: mode }),
      updateConfig: (newConfig) =>
        set((state) => {
          // Merge with defaults to ensure all required properties exist
          const mergedConfig = {
            ...DEFAULT_CONFIG,
            ...state.config,
            ...newConfig,
            // Ensure diceSettings is properly merged
            diceSettings: {
              ...DEFAULT_CONFIG.diceSettings,
              ...(state.config.diceSettings || {}),
              ...(newConfig.diceSettings || {}),
            },
            // Ensure enabledDice is an array
            enabledDice: newConfig.enabledDice || state.config.enabledDice || DEFAULT_CONFIG.enabledDice,
          }
          const config = mergedConfig
          // If enabled dice changed, ensure selected dice type is still enabled
          if (newConfig.enabledDice) {
            const enabledDice = newConfig.enabledDice
            if (!enabledDice.includes(state.selectedDiceType)) {
              const firstEnabled = enabledDice[0] as PolyhedralDiceType
              return {
                config,
                selectedDiceType: firstEnabled || state.selectedDiceType,
              }
            }
          }
          return { config }
        }),
      setSelectedDiceType: (diceType: PolyhedralDiceType) =>
        set({ selectedDiceType: diceType }),
      setDiceQuantity: (diceType: number, quantity: number) =>
        set((state) => ({
          diceQuantities: {
            ...state.diceQuantities,
            [diceType]: quantity,
          },
        })),
      toggleDiceType: (diceType: PolyhedralDiceType) =>
        set((state) => {
          const enabledDice = state.config.enabledDice || []
          const isEnabled = enabledDice.includes(diceType)
          let newEnabledDice: PolyhedralDiceType[]
          let newSelectedDiceType = state.selectedDiceType

          if (isEnabled) {
            // Remove from enabled list
            newEnabledDice = enabledDice.filter((d) => d !== diceType)
            // If the selected dice type was disabled, select the first remaining enabled dice
            if (newSelectedDiceType === diceType && newEnabledDice.length > 0) {
              newSelectedDiceType = newEnabledDice[0] as PolyhedralDiceType
            }
          } else {
            // Add to enabled list
            newEnabledDice = [...enabledDice, diceType].sort((a, b) => a - b)
          }

          // Merge with defaults to ensure all required properties exist
          const mergedConfig = {
            ...DEFAULT_CONFIG,
            ...state.config,
            enabledDice: newEnabledDice,
            diceSettings: {
              ...DEFAULT_CONFIG.diceSettings,
              ...(state.config.diceSettings || {}),
            },
          }

          return {
            config: mergedConfig,
            selectedDiceType: newSelectedDiceType,
          }
        }),
      setMaxQuantityForDice: (diceType: PolyhedralDiceType, maxQuantity: number) =>
        set((state) => {
          const safe = Math.max(1, Math.floor(maxQuantity))
          // Merge with defaults to ensure all required properties exist
          const mergedConfig = {
            ...DEFAULT_CONFIG,
            ...state.config,
            diceSettings: {
              ...DEFAULT_CONFIG.diceSettings,
              ...(state.config.diceSettings || {}),
              [diceType]: { maxQuantity: safe },
            },
          }
          return { config: mergedConfig }
        }),
    }),
    persistConfig: {
      name: 'daggerheart-storage',
      version: 1,
      migrations: [],
      schema: persistedStateSchema,
      partialize: (state): PersistedDaggerheartState => ({
        config: state.config,
        rollMode: state.rollMode,
        selectedDiceType: state.selectedDiceType,
        diceQuantities: state.diceQuantities,
      }),
    },
    devtoolsName: 'DaggerheartStore',
  })
)
