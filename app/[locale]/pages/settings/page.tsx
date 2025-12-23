'use client'

import { useTranslations } from 'next-intl'
import { useSettingsStore } from './settings-store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Settings2, Vibrate, Info, MoveHorizontal } from 'lucide-react'

export default function SettingsPage() {
  const t = useTranslations('Settings')
  const vibration = useSettingsStore((state) => state.vibration)
  const setDiceRollVibration = useSettingsStore((state) => state.setDiceRollVibration)
  const setSelectWheelVibration = useSettingsStore((state) => state.setSelectWheelVibration)
  const setAllVibration = useSettingsStore((state) => state.setAllVibration)
  const diceWheelOnRight = useSettingsStore((state) => state.diceWheelOnRight)
  const setDiceWheelOnRight = useSettingsStore((state) => state.setDiceWheelOnRight)

  // Check if all vibration options are enabled
  const allVibrationEnabled = vibration.diceRoll && vibration.selectWheel

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Settings2 className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <Vibrate className="h-5 w-5 text-primary" />
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{t('vibrationSettings')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('vibrationSettingsDescription')}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>{t('vibrationPlatformNote')}</AlertDescription>
          </Alert>

          <div className="space-y-4">
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

            <div className="space-y-4 border-l-2 border-muted pl-6 ml-2">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="diceRollVibration" className="text-base">{t('diceRollVibration')}</Label>
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
                  <Label htmlFor="selectWheelVibration" className="text-base">
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
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <MoveHorizontal className="h-5 w-5 text-primary" />
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{t('inputSettings')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('inputSettingsDescription')}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="diceWheelOnRight">{t('diceWheelOnRight')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('diceWheelOnRightDescription')}
              </p>
            </div>
            <Switch
              id="diceWheelOnRight"
              checked={diceWheelOnRight}
              onCheckedChange={(checked) => setDiceWheelOnRight(checked)}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
