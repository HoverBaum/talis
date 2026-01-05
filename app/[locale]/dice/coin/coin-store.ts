'use client'

import { create } from 'zustand'
import { createStoreMiddleware } from '@/utils/store-utils'

/**
 * Represents a coin type with display name and values for heads/tails.
 */
export type CoinType = {
  id: string
  displayName: string
  headsValue: string
  tailsValue: string
}

/**
 * Result of a coin flip.
 */
export type CoinFlipResult = {
  coinType: CoinType
  result: 'heads' | 'tails'
  timestamp: number
  id: string
}

/**
 * Default coin types that are always available.
 * The 'heads-tails' coin uses translation keys.
 */
export const DEFAULT_COINS: CoinType[] = [
  {
    id: 'heads-tails',
    displayName: 'Coin.headsLabel',
    headsValue: 'Coin.heads',
    tailsValue: 'Coin.tails',
  },
  {
    id: '0-1',
    displayName: '0/1',
    headsValue: '0',
    tailsValue: '1',
  },
]

const DEFAULT_CONFIG = {
  showNewResultBottom: true,
  customCoins: [] as CoinType[],
}

export type CoinConfigType = typeof DEFAULT_CONFIG

export interface CoinState {
  selectedCoinId: string
  flips: CoinFlipResult[]
  config: CoinConfigType
  setSelectedCoinId: (coinId: string) => void
  clearFlips: () => void
  addFlip: (flip: CoinFlipResult) => void
  updateConfig: (config: Partial<CoinConfigType>) => void
  addCustomCoin: (coin: CoinType) => void
  removeCustomCoin: (coinId: string) => void
  updateCustomCoin: (coinId: string, coin: Partial<CoinType>) => void
}

/**
 * Get all available coins (default + custom).
 */
export const getAllCoins = (config: CoinConfigType): CoinType[] => {
  return [...DEFAULT_COINS, ...config.customCoins]
}

/**
 * Get a coin by its ID.
 */
export const getCoinById = (
  coinId: string,
  config: CoinConfigType
): CoinType | undefined => {
  return getAllCoins(config).find((coin) => coin.id === coinId)
}

export const useCoinStore = create<CoinState>()(
  createStoreMiddleware({
    stateCreator: (set) => ({
      selectedCoinId: 'heads-tails',
      flips: [],
      config: DEFAULT_CONFIG,
      setSelectedCoinId: (coinId: string) => set({ selectedCoinId: coinId }),
      clearFlips: () => set({ flips: [] }),
      addFlip: (flip: CoinFlipResult) =>
        set((state) => ({
          flips: [...state.flips, flip],
        })),
      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
      addCustomCoin: (coin: CoinType) =>
        set((state) => ({
          config: {
            ...state.config,
            customCoins: [...state.config.customCoins, coin],
          },
        })),
      removeCustomCoin: (coinId: string) =>
        set((state) => {
          const newCustomCoins = state.config.customCoins.filter(
            (c) => c.id !== coinId
          )
          // If the removed coin was selected, switch to default
          const needsSwitch =
            state.selectedCoinId === coinId
              ? { selectedCoinId: 'heads-tails' }
              : {}
          return {
            ...needsSwitch,
            config: {
              ...state.config,
              customCoins: newCustomCoins,
            },
          }
        }),
      updateCustomCoin: (coinId: string, updates: Partial<CoinType>) =>
        set((state) => ({
          config: {
            ...state.config,
            customCoins: state.config.customCoins.map((c) =>
              c.id === coinId ? { ...c, ...updates } : c
            ),
          },
        })),
    }),
    persistConfig: {
      name: 'coin-storage',
      partialize: (state) => ({
        config: state.config,
        selectedCoinId: state.selectedCoinId,
      }),
    },
  })
)
