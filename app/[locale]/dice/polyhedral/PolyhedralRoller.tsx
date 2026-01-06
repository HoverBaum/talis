'use client'

/**
 * Main polyhedral dice roller component for standard polyhedral dice sets (d4, d6, d8, d10, d12, d20, d100).
 * 
 * Features:
 * - Dice type selection via buttons in footer (only shows enabled dice types from config)
 * - Quantity selection via scrollable wheel in control area
 * - Per-dice-type quantity storage (remembers quantity for each dice type separately)
 * - Roll history display with auto-scroll support
 * - Configurable display options (sort, sum, new results position)
 * 
 * Layout:
 * - Result area (left): Displays roll history with PolyhedralResultDisplay components
 * - Control area (right): DiceSelectWheel for quantity selection
 * - Footer: Dice type buttons, roll button, clear button, settings link
 * 
 * Performance considerations:
 * - Roll history can grow unbounded (user can clear manually)
 * - Uses reverse mapping for display (newest first)
 * - Auto-scroll only when enabled and new results appear
 * 
 * Assumptions:
 * - Config has at least one enabled dice type
 * - Selected dice type is always one of the enabled types
 * - Dice quantities are stored per type and default to 1 if not set
 * 
 * Used as the main page component for the polyhedral dice roller route.
 */
import { useTranslations } from 'next-intl'
import {
    PolyhedralRollResult,
    usePolyhedralStore,
    type PolyhedralDiceType,
} from './polyhedral-store'
import { DiceSelectWheel } from '@/components/DiceSelectWheel'
import {
    RollerLayout,
    RollerLayoutResultArea,
    RollerLayoutControlArea,
    RollerLayoutFooter,
    RollerLayoutContent,
} from '@/components/RollerLayout'
import { RollerControls } from '@/components/RollerControls'
import { PolyhedralResultDisplay } from '@/components/PolyhedralResultDisplay'
import { diceRollVibration } from '@/utils/diceRollVibration'
import { useAutoScroll } from '@/utils/use-auto-scroll'
import { Button } from '@/components/ui/button'
import { nanoid } from 'nanoid'

export function PolyhedralRoller() {
    const t = useTranslations('General')
    const rolls = usePolyhedralStore((state) => state.rolls)
    const config = usePolyhedralStore((state) => state.config)
    const selectedDiceType = usePolyhedralStore((state) => state.selectedDiceType)
    const setSelectedDiceType = usePolyhedralStore(
        (state) => state.setSelectedDiceType
    )
    const diceQuantities = usePolyhedralStore((state) => state.diceQuantities)
    const setDiceQuantity = usePolyhedralStore((state) => state.setDiceQuantity)
    const clearRolls = usePolyhedralStore((state) => state.clearRolls)
    const addRoll = usePolyhedralStore((state) => state.addRoll)

    const maxQuantity =
        config.diceSettings[selectedDiceType]?.maxQuantity ?? 8
    const currentQuantity = diceQuantities[selectedDiceType] ?? 1

    const rollDice = (diceType: PolyhedralDiceType, quantity: number) => {
        diceRollVibration(quantity)
        const diceRolls: number[] = []
        for (let i = 0; i < quantity; i++) {
            diceRolls.push(Math.floor(Math.random() * diceType) + 1)
        }
        const result: PolyhedralRollResult = {
            results: diceRolls,
            diceType,
            type: 'Polyhedral',
            timestamp: Date.now(),
            id: nanoid(),
        }

        addRoll(result)
    }

    useAutoScroll('polyhedralResults', config.showNewResultBottom, [
        rolls,
        config.showNewResultBottom,
    ])

    const handleQuantityChange = (quantity: number) => {
        setDiceQuantity(selectedDiceType, quantity)
    }

    return (
        <RollerLayout>
            <RollerLayoutContent>
                <div className="flex-grow grid grid-cols-12 h-0 pb-4">
                    <RollerLayoutResultArea
                        id="polyhedralResults"
                        showNewResultBottom={config.showNewResultBottom}
                        className="col-span-10"
                    >
                        {[...rolls].reverse().map((roll, index) => (
                            <PolyhedralResultDisplay
                                isHighlighted={index === 0}
                                key={roll.id}
                                diceRoll={roll}
                            />
                        ))}
                    </RollerLayoutResultArea>
                    <RollerLayoutControlArea className="col-span-2">
                        <DiceSelectWheel
                            max={maxQuantity}
                            current={currentQuantity}
                            onChange={handleQuantityChange}
                        />
                    </RollerLayoutControlArea>
                </div>
            </RollerLayoutContent>
            <RollerLayoutFooter>
                <RollerControls
                    onClear={clearRolls}
                    onRoll={() => rollDice(selectedDiceType, currentQuantity)}
                    rollDisabled={currentQuantity <= 0}
                    rollLabel={t('roll')}
                    settingsHref="polyhedral/config"
                >
                    <div className="flex gap-2">
                        {config.enabledDice.map((diceType) => (
                            <Button
                                key={diceType}
                                variant={selectedDiceType === diceType ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedDiceType(diceType as PolyhedralDiceType)}
                                className={selectedDiceType === diceType ? 'border border-transparent' : ''}
                            >
                                d{diceType}
                            </Button>
                        ))}
                    </div>
                </RollerControls>
            </RollerLayoutFooter>
        </RollerLayout>
    )
}

