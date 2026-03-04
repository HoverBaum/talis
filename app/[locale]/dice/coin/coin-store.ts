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
  resultColorMode: 'positive-negative' as 'none' | 'positive-negative',
  customCoins: [] as CoinType[],
}

export type CoinConfigType = typeof DEFAULT_CONFIG
const COIN_STORE_VERSION = 1

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
  config: CoinConfigType,
): CoinType | undefined => {
  return getAllCoins(config).find((coin) => coin.id === coinId)
}

type LegacyCoinConfig = {
  showNewResultBottom?: boolean
  customCoins?: CoinType[]
  resultColorMode?: CoinConfigType['resultColorMode'] | 'primary-accent'
  useColoredResults?: boolean
}

function migrateCoinPersistedState(
  persistedState: unknown,
): Partial<CoinState> {
  const state = (persistedState ?? {}) as Partial<CoinState>
  const legacyConfig = (state.config ?? {}) as LegacyCoinConfig

  const fallbackColorMode =
    legacyConfig.useColoredResults === false ? 'none' : 'positive-negative'
  const resultColorMode =
    legacyConfig.resultColorMode === 'none' ||
    legacyConfig.resultColorMode === 'positive-negative'
      ? legacyConfig.resultColorMode
      : fallbackColorMode

  return {
    ...state,
    selectedCoinId: state.selectedCoinId ?? 'heads-tails',
    config: {
      showNewResultBottom:
        legacyConfig.showNewResultBottom ?? DEFAULT_CONFIG.showNewResultBottom,
      resultColorMode,
      customCoins: legacyConfig.customCoins ?? [],
    },
  }
}

export const useCoinStore = create<CoinState>()(
  createStoreMiddleware({
    stateCreator: (set) => {
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
            const updated = { ...state.config, ...newConfig }
            return { config: updated }
          })
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
              (c) => c.id !== coinId,
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
      }
    },
    persistConfig: {
      name: 'coin-storage',
      version: COIN_STORE_VERSION,
      migrate: (persistedState) => migrateCoinPersistedState(persistedState),
      partialize: (state) => {
        return {
          config: state.config,
          selectedCoinId: state.selectedCoinId,
        }
      },
    },
  }),
)
