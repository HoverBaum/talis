'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useDaggerheartStore } from '../daggerheart-store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Settings2, ArrowLeft, Palette } from 'lucide-react'

export function DaggerheartConfig() {
  const t = useTranslations('Roller.Daggerheart.Config')
  const config = useDaggerheartStore((state) => state.config)
  const updateConfig = useDaggerheartStore((state) => state.updateConfig)

  return (
    <div className="max-w-160 mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <Settings2 className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
      </div>

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
