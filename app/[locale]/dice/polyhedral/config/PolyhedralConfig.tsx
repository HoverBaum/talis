'use client'

/**
 * Configuration page for the polyhedral dice roller.
 * 
 * Features:
 * - Dice type selection: Enable/disable dice types (d4, d6, d8, d10, d12, d20, d100)
 * - Per-dice settings: Configure maximum quantity for each enabled dice type
 * - Display settings: Configure result display options (sort, sum, new results position)
 * 
 * Layout:
 * - Single unified section for dice selection and max quantity configuration
 * - Each dice type shows checkbox and max quantity input on separate rows
 * - Max quantity input is disabled (but visible) when dice type is disabled to prevent layout shift
 * - Display settings section for result presentation options
 * 
 * Performance considerations:
 * - All dice types are always rendered (disabled inputs remain visible)
 * - Config updates are persisted to localStorage via Zustand store
 * 
 * Assumptions:
 * - Store is properly initialized with default config
 * - At least one dice type should remain enabled (UI doesn't enforce this)
 * - Max quantity must be at least 1
 * 
 * Used as the configuration page for the polyhedral dice roller, accessible via settings button.
 */
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePolyhedralStore, type PolyhedralDiceType } from '../polyhedral-store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/Button'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Settings2, ArrowLeft, Monitor, Dice1 } from 'lucide-react'

const ALL_DICE_TYPES: PolyhedralDiceType[] = [4, 6, 8, 10, 12, 20, 100]

export function PolyhedralConfig() {
    const t = useTranslations('Roller.Polyhedral.Config')
    const config = usePolyhedralStore((state) => state.config)
    const updateConfig = usePolyhedralStore((state) => state.updateConfig)

    const toggleDiceType = (diceType: PolyhedralDiceType) => {
        const isEnabled = config.enabledDice.includes(diceType)
        if (isEnabled) {
            // Remove from enabled list
            updateConfig({
                enabledDice: config.enabledDice.filter((d) => d !== diceType),
            })
        } else {
            // Add to enabled list
            updateConfig({
                enabledDice: [...config.enabledDice, diceType].sort((a, b) => a - b),
            })
        }
    }

    const setMaxQuantity = (diceType: PolyhedralDiceType, value: number) => {
        const safe = Math.max(1, Math.floor(value))
        updateConfig({
            diceSettings: {
                ...config.diceSettings,
                [diceType]: { maxQuantity: safe },
            },
        })
    }

    return (
        <div className="max-w-[40rem] mx-auto space-y-8">
            <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">{t('title')}</h1>
            </div>

            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <Dice1 className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">{t('diceSelection')}</h2>
                </div>
                <p className="text-sm text-muted-foreground -mt-4 ml-6">
                    {t('diceSelectionDescription')}
                </p>

                <div className="space-y-4 ml-6">
                    {ALL_DICE_TYPES.map((diceType) => {
                        const isEnabled = config.enabledDice.includes(diceType)
                        const maxQuantity =
                            config.diceSettings[diceType]?.maxQuantity ?? 8

                        return (
                            <div
                                key={diceType}
                                className="py-3 border-b last:border-0 space-y-2"
                            >
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id={`dice-${diceType}`}
                                        checked={isEnabled}
                                        onCheckedChange={() => toggleDiceType(diceType)}
                                    />
                                    <Label
                                        htmlFor={`dice-${diceType}`}
                                        className="text-base font-medium cursor-pointer"
                                    >
                                        d{diceType}
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2 ml-7">
                                    <Label
                                        htmlFor={`max-${diceType}`}
                                        className={`text-sm ${isEnabled ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}
                                    >
                                        {t('maxQuantity')}:
                                    </Label>
                                    <input
                                        id={`max-${diceType}`}
                                        type="number"
                                        min={1}
                                        value={maxQuantity}
                                        onChange={(e) =>
                                            setMaxQuantity(diceType, Number(e.target.value))
                                        }
                                        disabled={!isEnabled}
                                        className={`w-20 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">{t('displaySettings')}</h2>
                </div>
                <p className="text-sm text-muted-foreground -mt-4 ml-6">
                    {t('displaySettingsDescription')}
                </p>

                <div className="space-y-4 ml-6">
                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <Label htmlFor="newResultsBottom">
                                {t('newResultsAtBottom')}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {t('newResultsAtBottomDescription')}
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
                                {t('sortDiceDescription')}
                            </p>
                        </div>
                        <Switch
                            id="sortDice"
                            checked={config.sortDice}
                            onCheckedChange={(checked) =>
                                updateConfig({ sortDice: checked })
                            }
                        />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <Label htmlFor="sumDice">{t('sumDice')}</Label>
                            <p className="text-sm text-muted-foreground">
                                {t('sumDiceDescription')}
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
                <Link href="../polyhedral">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('back')}
                </Link>
            </Button>
        </div>
    )
}

