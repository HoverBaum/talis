'use client'

/**
 * Configuration page for the coin flipper.
 *
 * Features:
 * - Display settings: Configure result display options (new results position)
 * - Custom coins management: Add, edit, and remove custom coin types
 * - Each custom coin has: display name, heads value, tails value
 *
 * Layout:
 * - Display settings section for result presentation options
 * - Custom coins section with list of existing custom coins
 * - Form for adding new custom coins
 *
 * Performance considerations:
 * - Config updates are persisted to localStorage via Zustand store
 * - Custom coins list can grow but typically stays small
 *
 * Assumptions:
 * - Store is properly initialized with default config
 * - Custom coin IDs must be unique
 * - All three fields (displayName, headsValue, tailsValue) are required
 *
 * Used as the configuration page for the coin flipper, accessible via settings button.
 */
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useCoinStore, type CoinType } from '../coin-store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Settings2, ArrowLeft, Monitor, Coins, Plus, Trash2 } from 'lucide-react'

export const CoinConfig = () => {
  const t = useTranslations('Roller.Coin.Config')
  const config = useCoinStore((state) => state.config)
  const updateConfig = useCoinStore((state) => state.updateConfig)
  const addCustomCoin = useCoinStore((state) => state.addCustomCoin)
  const removeCustomCoin = useCoinStore((state) => state.removeCustomCoin)

  // Form state for adding new coins
  const [newCoinName, setNewCoinName] = useState('')
  const [newCoinHeads, setNewCoinHeads] = useState('')
  const [newCoinTails, setNewCoinTails] = useState('')

  const handleAddCoin = () => {
    if (!newCoinName.trim() || !newCoinHeads.trim() || !newCoinTails.trim()) {
      return
    }

    const newCoin: CoinType = {
      id: `custom-${Date.now()}`,
      displayName: newCoinName.trim(),
      headsValue: newCoinHeads.trim(),
      tailsValue: newCoinTails.trim(),
    }

    addCustomCoin(newCoin)
    setNewCoinName('')
    setNewCoinHeads('')
    setNewCoinTails('')
  }

  const isFormValid =
    newCoinName.trim() && newCoinHeads.trim() && newCoinTails.trim()

  return (
    <div className="max-w-[40rem] mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <Settings2 className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{t('displaySettings')}</h2>
        </div>
        <p className="text-sm text-muted-foreground -mt-4 ml-6">
          {t('displaySettingsDescription')}
        </p>

        <div className="space-y-4 ml-6">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="newResultsBottom">
                {t('newResultsAtBottom')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('newResultsAtBottomDescription')}
              </p>
            </div>
            <Switch
              id="newResultsBottom"
              checked={config.showNewResultBottom}
              onCheckedChange={(checked) =>
                updateConfig({ showNewResultBottom: checked })
              }
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{t('customCoins')}</h2>
        </div>
        <p className="text-sm text-muted-foreground -mt-4 ml-6">
          {t('customCoinsDescription')}
        </p>

        <div className="space-y-4 ml-6">
          {/* Existing custom coins */}
          {config.customCoins.length > 0 && (
            <div className="space-y-2">
              {config.customCoins.map((coin) => (
                <div
                  key={coin.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{coin.displayName}</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-roll-positive">{coin.headsValue}</span>
                      {' / '}
                      <span className="text-roll-negative">{coin.tailsValue}</span>
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCustomCoin(coin.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Separator className="my-4" />
            </div>
          )}

          {/* Add new coin form */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <h3 className="font-medium">{t('addNewCoin')}</h3>

            <div className="space-y-2">
              <Label htmlFor="coinName">{t('coinDisplayName')}</Label>
              <Input
                id="coinName"
                value={newCoinName}
                onChange={(e) => setNewCoinName(e.target.value)}
                placeholder={t('coinDisplayNamePlaceholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="headsValue" className="text-roll-positive">
                  {t('headsValue')}
                </Label>
                <Input
                  id="headsValue"
                  value={newCoinHeads}
                  onChange={(e) => setNewCoinHeads(e.target.value)}
                  placeholder={t('headsValuePlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tailsValue" className="text-roll-negative">
                  {t('tailsValue')}
                </Label>
                <Input
                  id="tailsValue"
                  value={newCoinTails}
                  onChange={(e) => setNewCoinTails(e.target.value)}
                  placeholder={t('tailsValuePlaceholder')}
                />
              </div>
            </div>

            <Button
              onClick={handleAddCoin}
              disabled={!isFormValid}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('addCoin')}
            </Button>
          </div>
        </div>
      </section>

      <Button asChild variant="outline" className="w-full">
        <Link href="../coin">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Link>
      </Button>
    </div>
  )
}
