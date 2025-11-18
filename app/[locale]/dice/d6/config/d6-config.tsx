'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useD6Store } from '@/stores/d6-store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function D6Config() {
  const t = useTranslations('Roller.D6.Config')
  const config = useD6Store((state) => state.config)
  const updateConfig = useD6Store((state) => state.updateConfig)

  return (
    <div className="max-w-[40rem] mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>D6 Configuration</CardTitle>
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
            <Label htmlFor="sortDice">{t('sortDice')}</Label>
            <Switch
              id="sortDice"
              checked={config.sortDice}
              onCheckedChange={(checked) => updateConfig({ sortDice: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sumDice">{t('sumDice')}</Label>
            <Switch
              id="sumDice"
              checked={config.sumDice}
              onCheckedChange={(checked) => updateConfig({ sumDice: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Button asChild className="w-full">
        <Link href="../d6">{t('back')}</Link>
      </Button>
    </div>
  )
}

