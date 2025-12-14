'use client'

import { create } from 'zustand'
import { z } from 'zod'
import { createStoreMiddleware } from '@/utils/store-utils'

export type PolyhedralDiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100

export type PolyhedralRollResult = {
  results: number[]
  diceType: PolyhedralDiceType
  type: 'Polyhedral'
  timestamp: number
  id: string
}

const DEFAULT_DICE_TYPES: PolyhedralDiceType[] = [4, 6, 8, 10, 12, 20, 100]
const DEFAULT_MAX_QUANTITY = 8

/**
 * Schema for persisted state (matches partialize output).
 * This is the single source of truth for the persisted state structure.
 */
const persistedStateSchema = z.object({
  config: z.object({
    enabledDice: z.array(z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10), z.literal(12), z.literal(20), z.literal(100)])),
    diceSettings: z.record(
      z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10), z.literal(12), z.literal(20), z.literal(100)]),
      z.object({
        maxQuantity: z.number().min(1).max(100),
      })
    ),
    showNewResultBottom: z.boolean(),
    sortDice: z.boolean(),
    sumDice: z.boolean(),
  }),
  selectedDiceType: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10), z.literal(12), z.literal(20), z.literal(100)]),
  diceQuantities: z.record(z.number(), z.number()),
})

/**
 * Type derived from schema - ensures type safety matches validation.
 * This is the single source of truth for persisted state structure.
 */
export type PersistedPolyhedralState = z.infer<typeof persistedStateSchema>

/**
 * Config type derived from schema - ensures type safety matches validation.
 * This is the single source of truth for config structure.
 */
export type PolyhedralConfigType = PersistedPolyhedralState['config']

const DEFAULT_CONFIG: PolyhedralConfigType = {
  enabledDice: DEFAULT_DICE_TYPES,
  diceSettings: DEFAULT_DICE_TYPES.reduce(
    (acc, diceType) => {
      acc[diceType] = { maxQuantity: DEFAULT_MAX_QUANTITY }
      return acc
    },
    {} as Record<number, { maxQuantity: number }>
  ),
  showNewResultBottom: true,
  sortDice: false,
  sumDice: false,
}

export interface PolyhedralState extends PersistedPolyhedralState {
  config: PolyhedralConfigType
  selectedDiceType: PolyhedralDiceType
  diceQuantities: Record<number, number>
  rolls: PolyhedralRollResult[]
  setSelectedDiceType: (diceType: PolyhedralDiceType) => void
  setDiceQuantity: (diceType: number, quantity: number) => void
  clearRolls: () => void
  addRoll: (roll: PolyhedralRollResult) => void
  updateConfig: (config: Partial<PolyhedralConfigType>) => void
}

export const usePolyhedralStore = create<PolyhedralState>()(
  createStoreMiddleware<PolyhedralState>({
    stateCreator: (set, get) => ({
      selectedDiceType: 6,
      diceQuantities: {},
      rolls: [],
      config: DEFAULT_CONFIG,
      setSelectedDiceType: (diceType: PolyhedralDiceType) =>
        set({ selectedDiceType: diceType }),
      setDiceQuantity: (diceType: number, quantity: number) =>
        set((state) => ({
          diceQuantities: {
            ...state.diceQuantities,
            [diceType]: quantity,
          },
        })),
      clearRolls: () => set({ rolls: [] }),
      addRoll: (roll: PolyhedralRollResult) =>
        set((state) => ({
          rolls: [...state.rolls, roll],
        })),
      updateConfig: (newConfig: Partial<PolyhedralConfigType>) =>
        set((state) => {
          const config = { ...state.config, ...newConfig }
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
    }),
    persistConfig: {
      name: 'polyhedral-storage',
      version: 1,
      migrations: [],
      schema: persistedStateSchema,
      partialize: (state): PersistedPolyhedralState => ({
        config: state.config,
        selectedDiceType: state.selectedDiceType,
        diceQuantities: state.diceQuantities,
      }),
    },
  })
)

