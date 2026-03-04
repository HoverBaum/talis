'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { MAX_DICE_AMOUNT, useShadowrunStore } from '../shadowrun-store'
import { useHasHydrated } from '@/hooks/useStoreHydration'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { QuickButtonConfig } from './QuickButtonConfig'
import { Separator } from '@/components/ui/separator'
import {
  Settings2,
  ArrowLeft,
  Plus,
  Zap,
  Monitor,
  Keyboard,
} from 'lucide-react'
import { nanoid } from 'nanoid'

const SwitchSkeleton = () => (
  <Skeleton className="h-[1.15rem] w-8 shrink-0 rounded-full" />
)

export function ShadowrunConfig() {
  const t = useTranslations('Roller.Shadowrun.Config')
  const hasHydrated = useHasHydrated(useShadowrunStore)
  const config = useShadowrunStore((state) => state.config)
  const updateConfig = useShadowrunStore((state) => state.updateConfig)
  const updateQuickButton = useShadowrunStore(
    (state) => state.updateQuickButton,
  )
  const deleteQuickButton = useShadowrunStore(
    (state) => state.deleteQuickButton,
  )

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
            {hasHydrated ? (
              <Switch
                id="newResultsBottom"
                checked={config.showNewResultBottom}
                onCheckedChange={(checked) =>
                  updateConfig({ showNewResultBottom: checked })
                }
              />
            ) : (
              <SwitchSkeleton />
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="themeHighlights">{t('useThemeHighlights')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('useThemeHighlightsDescription')}
              </p>
            </div>
            {hasHydrated ? (
              <Switch
                id="themeHighlights"
                checked={config.useThemeHighlights}
                onCheckedChange={(checked) =>
                  updateConfig({ useThemeHighlights: checked })
                }
              />
            ) : (
              <SwitchSkeleton />
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="sortDice">{t('sortDice')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('sortDiceDescription')}
              </p>
            </div>
            {hasHydrated ? (
              <Switch
                id="sortDice"
                checked={config.sortDice}
                onCheckedChange={(checked) =>
                  updateConfig({ sortDice: checked })
                }
              />
            ) : (
              <SwitchSkeleton />
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Keyboard className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{t('inputSettings')}</h2>
        </div>
        <p className="text-sm text-muted-foreground -mt-4 ml-6">
          {t('inputSettingsDescription')}
        </p>

        <div className="space-y-4 ml-6">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="maxDiceAmount">{t('maxDiceAmount')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('maxDiceAmountDescription')}
              </p>
            </div>
            {hasHydrated ? (
              <div className="flex items-center gap-2">
                <input
                  id="maxDiceAmount"
                  type="number"
                  min={1}
                  value={config.maxDiceAmount}
                  onChange={(e) =>
                    updateConfig({
                      maxDiceAmount: Math.max(
                        1,
                        Math.floor(Number(e.target.value)),
                      ),
                    })
                  }
                  className="w-20 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    updateConfig({ maxDiceAmount: MAX_DICE_AMOUNT })
                  }
                  title={t('resetMaxDiceAmountTooltip', {
                    amount: MAX_DICE_AMOUNT,
                  })}
                >
                  {t('resetMaxDiceAmount')}
                </Button>
              </div>
            ) : (
              <SwitchSkeleton />
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="freeInput">{t('freeInput')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('freeInputDescription')}
              </p>
            </div>
            {hasHydrated ? (
              <Switch
                id="freeInput"
                checked={config.useFreeInput}
                onCheckedChange={(checked) =>
                  updateConfig({ useFreeInput: checked })
                }
              />
            ) : (
              <SwitchSkeleton />
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="quickButtons">{t('quickButtons')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('quickButtonsDescription')}
              </p>
            </div>
            {hasHydrated ? (
              <Switch
                id="quickButtons"
                checked={config.useQuickButtons}
                onCheckedChange={(checked) =>
                  updateConfig({ useQuickButtons: checked })
                }
              />
            ) : (
              <SwitchSkeleton />
            )}
          </div>
        </div>
      </section>

      {config.useQuickButtons && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">{t('quickButtonsTitle')}</h2>
          </div>
          <p className="text-sm text-muted-foreground -mt-4 ml-6">
            {t('quickButtonsConfig')}
          </p>

          <div className="space-y-4 ml-6">
            {config.quickButtons.length > 0 ? (
              <div className="space-y-3">
                {config.quickButtons.map((button) => (
                  <QuickButtonConfig
                    key={button.id}
                    quickButton={button}
                    onUpdate={updateQuickButton}
                    onDelete={deleteQuickButton}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {t('noQuickButtons')}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                updateConfig({
                  quickButtons: [
                    ...config.quickButtons,
                    {
                      id: nanoid(),
                      amount: 8,
                      type: 'setAmount',
                    },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('addQuickButton')}
            </Button>
          </div>
        </section>
      )}

      <Button asChild variant="outline" className="w-full">
        <Link href="../shadowrun">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Link>
      </Button>
    </div>
  )
}
