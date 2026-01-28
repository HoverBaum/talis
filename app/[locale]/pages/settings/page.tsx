'use client'

/**
 * SettingsPage
 * - Central configuration page for app-wide settings
 * - Organized by importance: Theme, Mode, Language, then Vibration
 * - Uses clean section layout without cards for better readability
 * - Responsive down to 320px width
 */

import { useTranslations } from 'next-intl'
import { useSettingsStore } from './settings-store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LanguagePicker } from '@/components/LanguagePicker'
import { ThemePicker } from '@/components/ThemePicker'
import { ModePicker } from '@/components/ModePicker'
import { SetPageTitle } from '@/components/PageTitleProvider'
import { Settings2, Palette, Vibrate, Info } from 'lucide-react'

export default function SettingsPage() {
  const t = useTranslations('Settings')
  const tTheme = useTranslations('Theme')
  const tMode = useTranslations('Theme.mode')
  const tLanguage = useTranslations('Language')
  const vibration = useSettingsStore((state) => state.vibration)
  const setDiceRollVibration = useSettingsStore((state) => state.setDiceRollVibration)
  const setSelectWheelVibration = useSettingsStore((state) => state.setSelectWheelVibration)

  return (
    <>
      <SetPageTitle title={t('title')} />
      <div className="space-y-10 pb-4">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Settings2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        </div>

        {/* Appearance Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold">{t('appearance')}</h2>
              <p className="text-sm text-muted-foreground">
                {t('appearanceDescription')}
              </p>
            </div>
          </div>

          <div className="space-y-6 ml-7">
            {/* Theme Picker */}
            <div className="space-y-3">
              <Label id="theme-picker-label" className="text-base font-medium">
                {tTheme('select')}
              </Label>
              <ThemePicker groupLabelId="theme-picker-label" />
            </div>

            <Separator />

            {/* Mode Picker */}
            <div className="space-y-3">
              <Label id="mode-picker-label" className="text-base font-medium">
                {tMode('select')}
              </Label>
              <ModePicker groupLabelId="mode-picker-label" />
            </div>

            <Separator />

            {/* Language Picker */}
            <div className="space-y-3">
              <Label id="language-picker-label" className="text-base font-medium">
                {tLanguage('select')}
              </Label>
              <LanguagePicker groupLabelId="language-picker-label" />
            </div>
          </div>
        </section>

        {/* Vibration Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Vibrate className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold">{t('vibrationSettings')}</h2>
              <p className="text-sm text-muted-foreground">
                {t('vibrationSettingsDescription')}
              </p>
            </div>
          </div>

          <div className="space-y-4 ml-7">
            <Alert variant="default" className="bg-muted/50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {t('vibrationPlatformNote')}
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="diceRollVibration">{t('diceRollVibration')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('diceRollVibrationDescription')}
                </p>
              </div>
              <Switch
                id="diceRollVibration"
                checked={vibration.diceRoll}
                onCheckedChange={(checked) => setDiceRollVibration(checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="selectWheelVibration">
                  {t('selectWheelVibration')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('selectWheelVibrationDescription')}
                </p>
              </div>
              <Switch
                id="selectWheelVibration"
                checked={vibration.selectWheel}
                onCheckedChange={(checked) => setSelectWheelVibration(checked)}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
