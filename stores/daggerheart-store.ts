'use client'

import { create } from 'zustand'
import { createStoreMiddleware } from './store-utils'

export type DaggerheartRoll = {
  hope: number
  fear: number
  timestamp: number
  id: string
}

export interface DaggerheartState {
  rolls: DaggerheartRoll[]
  clearRolls: () => void
  addRoll: (roll: DaggerheartRoll) => void
}

export const useDaggerheartStore = create<DaggerheartState>()(
  createStoreMiddleware({
    stateCreator: (set) => ({
      rolls: [],
      clearRolls: () => set({ rolls: [] }),
      addRoll: (roll) =>
        set((state) => ({
          rolls: [...state.rolls, roll],
        })),
    }),
    devtoolsName: 'DaggerheartStore',
  })
)

