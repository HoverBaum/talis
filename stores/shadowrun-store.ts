'use client'

import { create } from 'zustand'
import { createStoreMiddleware } from './store-utils'

const MAX_DICE_AMOUNT = 50

export type QuickButtonTypes = 'instantRoll' | 'setAmount'
export type QuickButtonType = {
  amount: number
  type: QuickButtonTypes
  id: string
}

export type DiceRollType = {
  results: number[]
  type: 'Shadowrun'
  timestamp: number
  id: number
  shadowrun?: {
    hits: number
    isGlitch: boolean
    isCriticalGlitch: boolean
  }
}

const DEFAULT_CONFIG = {
  showNewResultBottom: true,
  useFreeInput: false,
  sortDice: false,
  isLoading: false,
  useQuickButtons: true,
  maxDiceAmount: MAX_DICE_AMOUNT,
  quickButtons: [
    {
      amount: 1,
      type: 'instantRoll' as QuickButtonTypes,
      id: 'initial1',
    },
    { amount: 8, type: 'setAmount' as QuickButtonTypes, id: 'initial2' },
    { amount: 20, type: 'setAmount' as QuickButtonTypes, id: 'initial3' },
  ] as QuickButtonType[],
}

export type ShadowrunConfigType = typeof DEFAULT_CONFIG

export interface ShadowrunState {
  diceAmount: number
  rolls: DiceRollType[]
  config: ShadowrunConfigType
  setDiceAmount: (amount: number) => void
  clearRolls: () => void
  addRoll: (roll: DiceRollType) => void
  updateConfig: (config: Partial<ShadowrunConfigType>) => void
  deleteQuickButton: (id: string) => void
  updateQuickButton: (button: Partial<QuickButtonType> & { id: string }) => void
}

export const useShadowrunStore = create<ShadowrunState>()(
  createStoreMiddleware({
    stateCreator: (set) => ({
      diceAmount: 8,
      rolls: [],
      config: DEFAULT_CONFIG,
      setDiceAmount: (amount) => set({ diceAmount: amount }),
      clearRolls: () => set({ rolls: [] }),
      addRoll: (roll) =>
        set((state) => ({
          rolls: [...state.rolls, roll],
        })),
      updateConfig: (newConfig) =>
        set((state) => {
          const config = { ...state.config, ...newConfig }
          return { config }
        }),
      deleteQuickButton: (id) =>
        set((state) => {
          const config = {
            ...state.config,
            quickButtons: state.config.quickButtons.filter(
              (button) => button.id !== id
            ),
          }
          return { config }
        }),
      updateQuickButton: (updatedButton) =>
        set((state) => {
          const config = {
            ...state.config,
            quickButtons: state.config.quickButtons.map((button) => {
              if (button.id === updatedButton.id) {
                return {
                  ...button,
                  ...updatedButton,
                }
              }
              return button
            }),
          }
          return { config }
        }),
    }),
    persistConfig: {
      name: 'shadowrun-storage',
      partialize: (state) => ({
        config: state.config,
        diceAmount: state.diceAmount,
      }),
    },
  })
)

