'use client'

/**
 * Common control buttons for dice rollers.
 * 
 * Provides:
 * - Clear button to remove all roll history
 * - Optional settings button linking to config page
 * - Roll button to execute dice roll
 * - Optional children slot for additional controls (e.g., FreeDiceInput, QuickButtons)
 * 
 * Used by all dice rollers with consistent styling and behavior.
 * The roll button label should be passed as a translated string from the parent component.
 */
import { ReactNode } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Settings, BrushCleaningIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type RollerControlsProps = {
    onClear: () => void
    onRoll: () => void
    rollDisabled?: boolean
    rollLabel: string
    settingsHref?: string
    children?: ReactNode
}

const ClearButtonWithTooltip = ({ onClear }: { onClear: () => void }) => {
    const t = useTranslations('Components.RollerControls')
    
    return (
        <Tooltip delayDuration={700}>
            <TooltipTrigger asChild >
                <Button variant="ghost" size="icon" onClick={onClear} >
                    <BrushCleaningIcon className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{t('clearRolls')}</p>
            </TooltipContent>
        </Tooltip>
    )
}

const SettingsButton = ({ href }: { href: string }) => {
    return (
        <Button variant="ghost" size="icon" asChild>
            <Link href={href}>
                <Settings className="h-4 w-4" />
            </Link>
        </Button>
    )
}

const ActionButtons = ({ onClear, settingsHref }: { onClear: () => void; settingsHref?: string }) => {
    return (
        <div className="flex gap-2">
            <ClearButtonWithTooltip onClear={onClear} />
            {settingsHref && <SettingsButton href={settingsHref} />}
        </div>
    )
}

export const RollerControls = ({
    onClear,
    onRoll,
    rollDisabled = false,
    rollLabel,
    settingsHref,
    children,
}: RollerControlsProps) => {
    return (
        <>
            {children ? (
                <div className="flex items-center justify-between py-2 overflow-hidden gap-2">
                    <div className="flex items-center gap-2 min-w-0 overflow-x-auto scrollbar-none">
                        {children}
                    </div>
                    <div className="flex-shrink-0">
                        <ActionButtons onClear={onClear} settingsHref={settingsHref} />
                    </div>
                </div>
            ) : (
                <div className="flex justify-end gap-2 mb-2">
                    <ActionButtons onClear={onClear} settingsHref={settingsHref} />
                </div>
            )}
            <Button
                disabled={rollDisabled}
                className="w-full my-2"
                onClick={onRoll}
            >
                {rollLabel}
            </Button>
        </>
    )
}

