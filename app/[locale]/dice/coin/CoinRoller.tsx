'use client'

/**
 * Main coin flipper component for flipping various types of coins.
 *
 * Features:
 * - Coin type selection via buttons in footer (shows all available coins)
 * - No quantity selection - always flips exactly one coin
 * - Flip history display with auto-scroll support
 * - Results display with color differentiation (heads = success, tails = destructive)
 * - Configurable display options (new results position)
 * - Support for custom coins defined in config
 *
 * Layout:
 * - Result area (full width): Displays flip history with CoinResultDisplay components
 * - No control area (no dice select wheel since we always flip one coin)
 * - Footer: Coin type buttons, flip button, clear button, settings link
 *
 * Performance considerations:
 * - Flip history can grow unbounded (user can clear manually)
 * - Uses reverse mapping for display (newest first)
 * - Auto-scroll only when enabled and new results appear
 *
 * Assumptions:
 * - Config has at least the default coins available
 * - Selected coin is always one of the available coins
 *
 * Used as the main page component for the coin flipper route.
 */
import { useTranslations } from 'next-intl'
import {
  useCoinStore,
  getAllCoins,
  getCoinById,
  type CoinFlipResult,
} from './coin-store'
import {
  RollerLayout,
  RollerLayoutResultArea,
  RollerLayoutFooter,
  RollerLayoutContent,
} from '@/components/RollerLayout'
import { RollerControls } from '@/components/RollerControls'
import { CoinResultDisplay } from './CoinResultDisplay'
import { diceRollVibration } from '@/utils/diceRollVibration'
import { useAutoScroll } from '@/utils/use-auto-scroll'
import {
  useHasHydrated,
  type StoreWithPersist,
} from '@/hooks/useStoreHydration'
import { Button } from '@/components/ui/button'
import { nanoid } from 'nanoid'

/**
 * Helper to get the display value for a coin, handling translation keys.
 */
const getCoinDisplayName = (
  displayName: string,
  t: ReturnType<typeof useTranslations<'Roller'>>,
): string => {
  if (displayName.startsWith('Coin.')) {
    const key = displayName.replace('Coin.', '')
    return t(`Coin.${key}` as Parameters<typeof t>[0])
  }
  return displayName
}

export const CoinRoller = () => {
  const tRoller = useTranslations('Roller')
  const hasHydrated = useHasHydrated(
    useCoinStore as unknown as StoreWithPersist,
  )
  const flips = useCoinStore((state) => state.flips)
  const config = useCoinStore((state) => state.config)
  const selectedCoinId = useCoinStore((state) => state.selectedCoinId)
  const setSelectedCoinId = useCoinStore((state) => state.setSelectedCoinId)
  const clearFlips = useCoinStore((state) => state.clearFlips)
  const addFlip = useCoinStore((state) => state.addFlip)

  const allCoins = getAllCoins(config)
  const selectedCoin = getCoinById(selectedCoinId, config) || allCoins[0]

  const flipCoin = () => {
    diceRollVibration(1)
    const result: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails'

    const flip: CoinFlipResult = {
      coinType: selectedCoin,
      result,
      timestamp: Date.now(),
      id: nanoid(),
    }

    addFlip(flip)
  }

  useAutoScroll('coinResults', config.showNewResultBottom, [
    flips,
    config.showNewResultBottom,
  ])

  return (
    <RollerLayout>
      <RollerLayoutContent>
        <RollerLayoutResultArea
          id="coinResults"
          showNewResultBottom={config.showNewResultBottom}
          className="pb-2"
        >
          {[...flips].reverse().map((flip, index) => (
            <CoinResultDisplay
              isHighlighted={index === 0}
              key={flip.id}
              flip={flip}
            />
          ))}
        </RollerLayoutResultArea>
      </RollerLayoutContent>
      <RollerLayoutFooter>
        <RollerControls
          onClear={clearFlips}
          onRoll={flipCoin}
          rollLabel={tRoller('Coin.flip')}
          settingsHref="coin/config"
        >
          {/* Wait for hydration before rendering config-dependent custom coins */}
          {hasHydrated && (
            <div className="flex gap-2">
              {allCoins.map((coin) => (
                <Button
                  key={coin.id}
                  variant={selectedCoinId === coin.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCoinId(coin.id)}
                  className={
                    selectedCoinId === coin.id
                      ? 'border border-transparent'
                      : ''
                  }
                >
                  {getCoinDisplayName(coin.displayName, tRoller)}
                </Button>
              ))}
            </div>
          )}
        </RollerControls>
      </RollerLayoutFooter>
    </RollerLayout>
  )
}
