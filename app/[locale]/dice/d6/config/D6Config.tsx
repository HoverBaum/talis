'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useD6Store } from '../d6-store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Settings2, ArrowLeft, Monitor } from 'lucide-react'

export function D6Config() {
  const t = useTranslations('Roller.D6.Config')
  const config = useD6Store((state) => state.config)
  const updateConfig = useD6Store((state) => state.updateConfig)

  return (
    <div className="max-w-[40rem] mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <Settings2 className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">D6 Configuration</h1>
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

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="sumDice">{t('sumDice')}</Label>
              <p className="text-sm text-muted-foreground">
                Display the sum of all dice values
              </p>
            </div>
            <Switch
              id="sumDice"
              checked={config.sumDice}
              onCheckedChange={(checked) => updateConfig({ sumDice: checked })}
            />
          </div>
        </div>
      </section>

      <Button asChild variant="outline" className="w-full">
        <Link href="../d6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Link>
      </Button>
    </div>
  )
}

