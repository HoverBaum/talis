'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useShadowrunStore } from '@/stores/shadowrun-store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { QuickButtonConfig } from './quick-button-config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ShadowrunConfig() {
  const t = useTranslations('Roller.Shadowrun.Config')
  const config = useShadowrunStore((state) => state.config)
  const updateConfig = useShadowrunStore((state) => state.updateConfig)
  const updateQuickButton = useShadowrunStore((state) => state.updateQuickButton)
  const deleteQuickButton = useShadowrunStore((state) => state.deleteQuickButton)

  return (
    <div className="max-w-[40rem] mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Shadowrun Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="newResultsBottom">{t('newResultsAtBottom')}</Label>
            <Switch
              id="newResultsBottom"
              checked={config.showNewResultBottom}
              onCheckedChange={(checked) =>
                updateConfig({ showNewResultBottom: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="freeInput">{t('freeInput')}</Label>
            <Switch
              id="freeInput"
              checked={config.useFreeInput}
              onCheckedChange={(checked) =>
                updateConfig({ useFreeInput: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sortDice">{t('sortDice')}</Label>
            <Switch
              id="sortDice"
              checked={config.sortDice}
              onCheckedChange={(checked) => updateConfig({ sortDice: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="quickButtons">{t('quickButtons')}</Label>
            <Switch
              id="quickButtons"
              checked={config.useQuickButtons}
              onCheckedChange={(checked) =>
                updateConfig({ useQuickButtons: checked })
              }
            />
          </div>

          {config.useQuickButtons && (
            <div className="p-6 border rounded-lg space-y-4">
              <div className="space-y-4">
                {config.quickButtons.map((button) => (
                  <QuickButtonConfig
                    key={button.id}
                    quickButton={button}
                    onUpdate={updateQuickButton}
                    onDelete={deleteQuickButton}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
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
                {t('addQuickButton')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Button asChild className="w-full">
        <Link href="../shadowrun">{t('back')}</Link>
      </Button>
    </div>
  )
}

