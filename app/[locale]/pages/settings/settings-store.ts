'use client'

import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export interface SettingsState {
  vibration: {
    diceRoll: boolean
    selectWheel: boolean
  }
  diceWheelOnRight: boolean
  setVibration: (vibration: Partial<SettingsState['vibration']>) => void
  setDiceRollVibration: (enabled: boolean) => void
  setSelectWheelVibration: (enabled: boolean) => void
  setAllVibration: (enabled: boolean) => void
  setDiceWheelOnRight: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        vibration: {
          diceRoll: true,
          selectWheel: true,
        },
        diceWheelOnRight: true,
        setVibration: (newVibration) =>
          set((state) => ({
            vibration: { ...state.vibration, ...newVibration },
          })),
        setDiceRollVibration: (enabled) =>
          set((state) => ({
            vibration: { ...state.vibration, diceRoll: enabled },
          })),
        setSelectWheelVibration: (enabled) =>
          set((state) => ({
            vibration: { ...state.vibration, selectWheel: enabled },
          })),
        setAllVibration: (enabled) =>
          set({
            vibration: {
              diceRoll: enabled,
              selectWheel: enabled,
            },
          }),
        setDiceWheelOnRight: (enabled) =>
          set({
            diceWheelOnRight: enabled,
          }),
      }),
      {
        name: 'talis-settings',
        partialize: (state) => ({
          vibration: state.vibration,
          diceWheelOnRight: state.diceWheelOnRight,
        }),
      }
    ),
    {
      name: 'SettingsStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)
