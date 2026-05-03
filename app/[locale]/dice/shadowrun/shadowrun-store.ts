'use client'

import { create } from 'zustand'
import { createStoreMiddleware } from '@/utils/store-utils'

export const MAX_DICE_AMOUNT = 30
export const DEFAULT_HIT_LIMIT = 6
export const DEFAULT_THRESHOLD = 1

export type QuickButtonTypes = 'instantRoll' | 'setAmount'
export type ShadowrunRollMode = 'standard' | 'edge'

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
    rawHits: number
    ones: number
    isGlitch: boolean
    isCriticalGlitch: boolean
    appliedLimit?: number | null
    threshold?: number
    thresholdMet?: boolean
    extraDiceFromExplosions?: number
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
  useRuleOfSix: false,
  useHitLimit: false,
  hitLimit: DEFAULT_HIT_LIMIT,
  useThreshold: false,
  threshold: DEFAULT_THRESHOLD,
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
  rollMode: ShadowrunRollMode
  rolls: DiceRollType[]
  config: ShadowrunConfigType
  setDiceAmount: (amount: number) => void
  setRollMode: (mode: ShadowrunRollMode) => void
  clearRolls: () => void
  addRoll: (roll: DiceRollType) => void
  updateConfig: (config: Partial<ShadowrunConfigType>) => void
  deleteQuickButton: (id: string) => void
  updateQuickButton: (button: Partial<QuickButtonType> & { id: string }) => void
}

const sanitizeDiceAmount = (amount: number, maxDiceAmount: number) =>
  Math.min(maxDiceAmount, Math.max(0, Math.floor(amount)))

const sanitizeQuickButtonAmount = (amount: number, maxDiceAmount: number) =>
  Math.min(maxDiceAmount, Math.max(1, Math.floor(amount)))

const sanitizeConfig = (
  config: ShadowrunConfigType,
  fallbackMaxDiceAmount = MAX_DICE_AMOUNT
): ShadowrunConfigType => {
  const safeMaxDiceAmount = Math.max(
    1,
    Math.floor(config.maxDiceAmount || fallbackMaxDiceAmount)
  )

  return {
    ...config,
    maxDiceAmount: safeMaxDiceAmount,
    hitLimit: Math.max(1, Math.floor(config.hitLimit || DEFAULT_HIT_LIMIT)),
    threshold: Math.max(1, Math.floor(config.threshold || DEFAULT_THRESHOLD)),
    quickButtons: config.quickButtons.map((button) => ({
      ...button,
      amount: sanitizeQuickButtonAmount(button.amount, safeMaxDiceAmount),
    })),
  }
}

export const useShadowrunStore = create<ShadowrunState>()(
  createStoreMiddleware({
    stateCreator: (set) => ({
      diceAmount: 8,
      rollMode: 'standard',
      rolls: [],
      config: DEFAULT_CONFIG,
      setDiceAmount: (amount) =>
        set((state) => ({
          diceAmount: sanitizeDiceAmount(amount, state.config.maxDiceAmount),
        })),
      setRollMode: (rollMode) => set({ rollMode }),
      clearRolls: () => set({ rolls: [] }),
      addRoll: (roll) =>
        set((state) => ({
          rolls: [...state.rolls, roll],
        })),
      updateConfig: (newConfig) =>
        set((state) => {
          const config = sanitizeConfig(
            { ...state.config, ...newConfig },
            state.config.maxDiceAmount
          )
          const diceAmount = sanitizeDiceAmount(
            state.diceAmount,
            config.maxDiceAmount
          )

          return { config, diceAmount }
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
              const safeAmount =
                typeof updatedButton.amount === 'number'
                  ? sanitizeQuickButtonAmount(
                      updatedButton.amount,
                      state.config.maxDiceAmount
                    )
                  : undefined

              if (button.id === updatedButton.id) {
                return {
                  ...button,
                  ...updatedButton,
                  ...(typeof safeAmount === 'number' && { amount: safeAmount }),
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
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as Partial<ShadowrunState> | undefined
        const restoredConfig = sanitizeConfig({
          ...DEFAULT_CONFIG,
          ...(state?.config ?? {}),
          quickButtons:
            state?.config?.quickButtons ?? DEFAULT_CONFIG.quickButtons,
        })
        const restoredDiceAmount = sanitizeDiceAmount(
          state?.diceAmount ?? 8,
          restoredConfig.maxDiceAmount
        )

        return {
          ...state,
          config: restoredConfig,
          diceAmount: restoredDiceAmount,
          rollMode: state?.rollMode ?? 'standard',
        }
      },
      partialize: (state) => ({
        config: state.config,
        diceAmount: state.diceAmount,
        rollMode: state.rollMode,
      }),
    },
  })
)
