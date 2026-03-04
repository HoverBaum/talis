'use client'

import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export type SidebarOptions = 'full' | 'condensed' | 'none'

export interface SettingsState {
  vibration: {
    diceRoll: boolean
    selectWheel: boolean
  }
  sidebarOptions: SidebarOptions
  iosNavigationEnabled?: boolean
  setVibration: (vibration: Partial<SettingsState['vibration']>) => void
  setDiceRollVibration: (enabled: boolean) => void
  setSelectWheelVibration: (enabled: boolean) => void
  setAllVibration: (enabled: boolean) => void
  setSidebarOptions: (value: SidebarOptions) => void
  setIosNavigationEnabled: (enabled: boolean) => void
  initializeIosNavigationEnabled: (isIOSDevice: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        vibration: {
          diceRoll: true,
          selectWheel: true,
        },
        sidebarOptions: 'full',
        iosNavigationEnabled: undefined,
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
        setSidebarOptions: (value) => set({ sidebarOptions: value }),
        setIosNavigationEnabled: (enabled) => set({ iosNavigationEnabled: enabled }),
        initializeIosNavigationEnabled: (isIOSDevice) =>
          set((state) =>
            typeof state.iosNavigationEnabled === 'undefined'
              ? { iosNavigationEnabled: isIOSDevice }
              : state
          ),
      }),
      {
        name: 'talis-settings',
        partialize: (state) => ({
          vibration: state.vibration,
          sidebarOptions: state.sidebarOptions,
          iosNavigationEnabled: state.iosNavigationEnabled,
        }),
      }
    ),
    {
      name: 'SettingsStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)
