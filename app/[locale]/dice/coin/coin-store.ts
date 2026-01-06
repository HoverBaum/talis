'use client'

import { create } from 'zustand'
import { createStoreMiddleware, STORAGE_PREFIX } from '@/utils/store-utils'

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
 * Coins with translation keys (starting with 'Coin.') will be translated.
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
  {
    id: 'yes-no',
    displayName: 'Coin.yesNoLabel',
    headsValue: 'Coin.yes',
    tailsValue: 'Coin.no',
  },
]

const DEFAULT_CONFIG = {
  showNewResultBottom: true,
  resultColorMode: 'positive-negative' as 'none' | 'positive-negative' | 'primary-accent',
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

// Migration: Handle old localStorage data before Zustand loads it
if (typeof window !== 'undefined') {
  try {
    const storageKey = `${STORAGE_PREFIX}-coin-storage`
    const persistedState = localStorage.getItem(storageKey)
    if (persistedState) {
      const parsed = JSON.parse(persistedState)
      if (parsed?.state?.config) {
        const config = parsed.state.config
        // Migrate old useColoredResults boolean to new resultColorMode
        if ('useColoredResults' in config && !('resultColorMode' in config)) {
          const migratedConfig = {
            ...config,
            resultColorMode: config.useColoredResults
              ? 'positive-negative'
              : 'none',
          }
          delete migratedConfig.useColoredResults
          // Update localStorage with migrated data
          parsed.state.config = migratedConfig
          localStorage.setItem(storageKey, JSON.stringify(parsed))
        }
      }
    }
  } catch (e) {
    // If migration fails, continue with defaults
  }
}

export const useCoinStore = create<CoinState>()(
  createStoreMiddleware({
    stateCreator: (set, get, api) => {
      return {
        selectedCoinId: 'heads-tails',
        flips: [],
        config: DEFAULT_CONFIG,
        setSelectedCoinId: (coinId: string) => set({ selectedCoinId: coinId }),
        clearFlips: () => set({ flips: [] }),
        addFlip: (flip: CoinFlipResult) =>
          set((state) => ({
            flips: [...state.flips, flip],
          })),
        updateConfig: (newConfig) => {
          return set((state) => {
            const updated = { ...state.config, ...newConfig };
            return { config: updated };
          });
        },
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
          })
      }
    },
    persistConfig: {
      name: 'coin-storage',
      partialize: (state) => {
        return {
          config: state.config,
          selectedCoinId: state.selectedCoinId,
        };
      },
    },
  })
)
