'use client'

import { create } from 'zustand'
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

const DEFAULT_CONFIG = {
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

export type PolyhedralConfigType = typeof DEFAULT_CONFIG

export interface PolyhedralState {
  selectedDiceType: PolyhedralDiceType
  diceQuantities: Record<number, number>
  rolls: PolyhedralRollResult[]
  config: PolyhedralConfigType
  setSelectedDiceType: (diceType: PolyhedralDiceType) => void
  setDiceQuantity: (diceType: number, quantity: number) => void
  clearRolls: () => void
  addRoll: (roll: PolyhedralRollResult) => void
  updateConfig: (config: Partial<PolyhedralConfigType>) => void
}

export const usePolyhedralStore = create<PolyhedralState>()(
  createStoreMiddleware({
    stateCreator: (set) => ({
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
      updateConfig: (newConfig) =>
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
      partialize: (state) => ({
        config: state.config,
        selectedDiceType: state.selectedDiceType,
        diceQuantities: state.diceQuantities,
      }),
    },
  })
)

