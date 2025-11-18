'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useShadowrunStore } from '../shadowrun-store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { QuickButtonConfig } from './QuickButtonConfig'
import { Separator } from '@/components/ui/separator'
import { Settings2, ArrowLeft, Plus, Zap, Monitor, Keyboard } from 'lucide-react'

export function ShadowrunConfig() {
  const t = useTranslations('Roller.Shadowrun.Config')
  const config = useShadowrunStore((state) => state.config)
  const updateConfig = useShadowrunStore((state) => state.updateConfig)
  const updateQuickButton = useShadowrunStore((state) => state.updateQuickButton)
  const deleteQuickButton = useShadowrunStore((state) => state.deleteQuickButton)

  return (
    <div className="max-w-[40rem] mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <Settings2 className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Shadowrun Configuration</h1>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Display Settings</h2>
        </div>
        <p className="text-sm text-muted-foreground -mt-4 ml-6">
          Configure how dice results are displayed and organized
        </p>

        <div className="space-y-4 ml-6">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="newResultsBottom">{t('newResultsAtBottom')}</Label>
              <p className="text-sm text-muted-foreground">
                Show new results at the bottom of the list
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

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="sortDice">{t('sortDice')}</Label>
              <p className="text-sm text-muted-foreground">
                Automatically sort dice results
              </p>
            </div>
            <Switch
              id="sortDice"
              checked={config.sortDice}
              onCheckedChange={(checked) => updateConfig({ sortDice: checked })}
            />
          </div>
        </div>
      </section>



      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Keyboard className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Input Settings</h2>
        </div>
        <p className="text-sm text-muted-foreground -mt-4 ml-6">
          Configure dice input methods and options
        </p>

        <div className="space-y-4 ml-6">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="freeInput">{t('freeInput')}</Label>
              <p className="text-sm text-muted-foreground">
                Enable free-form dice input
              </p>
            </div>
            <Switch
              id="freeInput"
              checked={config.useFreeInput}
              onCheckedChange={(checked) =>
                updateConfig({ useFreeInput: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="quickButtons">{t('quickButtons')}</Label>
              <p className="text-sm text-muted-foreground">
                Show quick action buttons for common rolls
              </p>
            </div>
            <Switch
              id="quickButtons"
              checked={config.useQuickButtons}
              onCheckedChange={(checked) =>
                updateConfig({ useQuickButtons: checked })
              }
            />
          </div>
        </div>
      </section>

      {config.useQuickButtons && (


        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Quick Buttons</h2>
          </div>
          <p className="text-sm text-muted-foreground -mt-4 ml-6">
            Configure quick action buttons for faster dice rolling
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
                No quick buttons configured. Add one below to get started.
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
                      id: Math.random().toString(36).substring(5),
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

