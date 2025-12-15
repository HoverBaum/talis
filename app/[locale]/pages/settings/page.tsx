'use client'

import { useTranslations } from 'next-intl'
import { useSettingsStore } from './settings-store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Settings2, Vibrate, Info } from 'lucide-react'

export default function SettingsPage() {
  const t = useTranslations('Settings')
  const vibration = useSettingsStore((state) => state.vibration)
  const setDiceRollVibration = useSettingsStore((state) => state.setDiceRollVibration)
  const setSelectWheelVibration = useSettingsStore((state) => state.setSelectWheelVibration)
  const setAllVibration = useSettingsStore((state) => state.setAllVibration)

  // Check if all vibration options are enabled
  const allVibrationEnabled = vibration.diceRoll && vibration.selectWheel

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[40rem] mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">{t('title')}</h1>
        </div>

        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Vibrate className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">{t('vibrationSettings')}</h2>
          </div>
          <p className="text-sm text-muted-foreground -mt-4 ml-6">
            {t('vibrationSettingsDescription')}
          </p>

          <Alert className="ml-6">
            <Info className="h-4 w-4" />
            <AlertDescription>{t('vibrationPlatformNote')}</AlertDescription>
          </Alert>

          <div className="space-y-4 ml-6">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="enableAllVibration">{t('enableAllVibration')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('enableAllVibrationDescription')}
                </p>
              </div>
              <Switch
                id="enableAllVibration"
                checked={allVibrationEnabled}
                onCheckedChange={(checked) => setAllVibration(checked)}
              />
            </div>

            <Separator />

            <div className="ml-6 space-y-4 border-l-2 border-muted pl-4">
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
          </div>
        </section>
      </div>
    </div>
  )
}
