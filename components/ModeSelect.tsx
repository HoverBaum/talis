'use client'

import { Mode, useTheme } from './ThemeProvider'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useTranslations } from 'next-intl'

type ModeSelectProps = {
    className?: string
}

export function ModeSelect({ className }: ModeSelectProps) {
    const { mode, setMode } = useTheme()
    const t = useTranslations('Theme.mode')

    return (
        <div className={className}>
            <label className="text-sm font-medium mb-2 block">
                {t('select')}
            </label>
            <Select value={mode} onValueChange={(value) => setMode(value as Mode)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('select')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="system">{t('system')}</SelectItem>
                    <SelectItem value="light">{t('light')}</SelectItem>
                    <SelectItem value="dark">{t('dark')}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

