'use client'

import { create } from 'zustand'
import { createStoreMiddleware } from '@/utils/store-utils'
import { sanitizeIntegerInRange } from '@/utils/number-utils'

export const MAX_DICE_AMOUNT = 30
const MAX_DICE_LIMIT = 999

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
  id: string
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
  useThemeHighlights: true,
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
      setDiceAmount: (amount) =>
        set((state) => ({
          diceAmount: sanitizeIntegerInRange(amount, {
            min: 1,
            max: state.config.maxDiceAmount,
            fallback: 1,
          }),
        })),
      clearRolls: () => set({ rolls: [] }),
      addRoll: (roll) =>
        set((state) => ({
          rolls: [...state.rolls, roll],
        })),
      updateConfig: (newConfig) =>
        set((state) => {
          const config = { ...state.config, ...newConfig }
          const maxDiceAmount = sanitizeIntegerInRange(config.maxDiceAmount, {
            min: 1,
            max: MAX_DICE_LIMIT,
            fallback: MAX_DICE_AMOUNT,
          })
          config.maxDiceAmount = maxDiceAmount

          const clampAmount = (amount: number, fallback: number) =>
            sanitizeIntegerInRange(amount, {
              min: 1,
              max: maxDiceAmount,
              fallback,
            })

          return {
            config: {
              ...config,
              quickButtons: config.quickButtons.map((button) => ({
                ...button,
                amount: clampAmount(button.amount, 1),
              })),
            },
            diceAmount: clampAmount(state.diceAmount, 1),
          }
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
