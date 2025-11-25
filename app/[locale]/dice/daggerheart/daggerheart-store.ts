'use client'

import { create } from 'zustand'
import { createStoreMiddleware } from '@/utils/store-utils'

export type DaggerheartRoll = {
  hope: number
  fear: number
  timestamp: number
  id: string
}

const DEFAULT_CONFIG = {
  useThemeColors: false,
}

export type DaggerheartConfigType = typeof DEFAULT_CONFIG

export interface DaggerheartState {
  rolls: DaggerheartRoll[]
  config: DaggerheartConfigType
  clearRolls: () => void
  addRoll: (roll: DaggerheartRoll) => void
  updateConfig: (config: Partial<DaggerheartConfigType>) => void
}

export const useDaggerheartStore = create<DaggerheartState>()(
  createStoreMiddleware({
    stateCreator: (set) => ({
      rolls: [],
      config: DEFAULT_CONFIG,
      clearRolls: () => set({ rolls: [] }),
      addRoll: (roll) =>
        set((state) => ({
          rolls: [...state.rolls, roll],
        })),
      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
    }),
    persistConfig: {
      name: 'daggerheart-storage',
      partialize: (state) => ({
        config: state.config,
        rolls: state.rolls,
      }),
    },
    devtoolsName: 'DaggerheartStore',
  })
)
