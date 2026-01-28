'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import Link from 'next/link'
import { useDaggerheartStore } from '../daggerheart-store'
import { type PolyhedralDiceType } from '../../polyhedral/polyhedral-store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/Button'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Settings2, ArrowLeft, Palette, Dice1 } from 'lucide-react'

const ALL_DICE_TYPES: PolyhedralDiceType[] = [4, 6, 8, 10, 12, 20, 100]

export function DaggerheartConfig() {
  const t = useTranslations('Roller.Daggerheart.Config')
  const tPolyhedral = useTranslations('Roller.Polyhedral.Config')
  const config = useDaggerheartStore((state) => state.config)
  const updateConfig = useDaggerheartStore((state) => state.updateConfig)
  const toggleDiceType = useDaggerheartStore((state) => state.toggleDiceType)
  const setMaxQuantityForDice = useDaggerheartStore(
    (state) => state.setMaxQuantityForDice
  )

  // Migrate config on mount if it's missing new properties
  useEffect(() => {
    if (!config.diceSettings || !config.enabledDice) {
      updateConfig({})
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-[40rem] mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <Settings2 className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Dice1 className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{tPolyhedral('diceSelection')}</h2>
        </div>
        <p className="text-sm text-muted-foreground -mt-4 ml-6">
          {tPolyhedral('diceSelectionDescription')}
        </p>

        <div className="space-y-4 ml-6">
          {ALL_DICE_TYPES.map((diceType) => {
            const enabledDice = config.enabledDice || []
            const isEnabled = enabledDice.includes(diceType)
            const maxQuantity =
              config.diceSettings?.[diceType]?.maxQuantity ?? 8

            return (
              <div
                key={diceType}
                className="py-3 border-b last:border-0 space-y-2"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`dice-${diceType}`}
                    checked={isEnabled}
                    onCheckedChange={() => toggleDiceType(diceType)}
                  />
                  <Label
                    htmlFor={`dice-${diceType}`}
                    className="text-base font-medium cursor-pointer"
                  >
                    d{diceType}
                  </Label>
                </div>
                <div className="flex items-center gap-2 ml-7">
                  <Label
                    htmlFor={`max-${diceType}`}
                    className={`text-sm ${isEnabled ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}
                  >
                    {tPolyhedral('maxQuantity')}:
                  </Label>
                  <input
                    id={`max-${diceType}`}
                    type="number"
                    min={1}
                    value={maxQuantity}
                    onChange={(e) =>
                      setMaxQuantityForDice(diceType, Number(e.target.value))
                    }
                    disabled={!isEnabled}
                    className={`w-20 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{t('displaySettings')}</h2>
        </div>
        <p className="text-sm text-muted-foreground -mt-4 ml-6">
          {t('displaySettingsDescription')}
        </p>

        <div className="space-y-4 ml-6">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="useThemeColors">{t('useThemeColors')}</Label>
            </div>
            <Switch
              id="useThemeColors"
              checked={config.useThemeColors}
              onCheckedChange={(checked) =>
                updateConfig({ useThemeColors: checked })
              }
            />
          </div>
          <Separator />
        </div>
      </section>

      <Button asChild variant="outline" className="w-full">
        <Link href="../daggerheart">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Link>
      </Button>
    </div>
  )
}
