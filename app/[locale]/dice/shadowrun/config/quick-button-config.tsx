'use client'

import { useTranslations } from 'next-intl'
import { QuickButtonType } from '@/stores/shadowrun-store'
import { FreeDiceInput } from '../free-dice-input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useShadowrunStore } from '@/stores/shadowrun-store'

type QuickButtonConfigProps = {
  quickButton: QuickButtonType
  onUpdate: (button: Partial<QuickButtonType> & { id: string }) => void
  onDelete: (id: string) => void
}

export function QuickButtonConfig({
  quickButton,
  onUpdate,
  onDelete,
}: QuickButtonConfigProps) {
  const t = useTranslations('Roller.Shadowrun.Config')
  const maxDiceAmount = useShadowrunStore((state) => state.config.maxDiceAmount)

  return (
    <div className="grid grid-cols-6 grid-rows-2 md:grid-rows-1 md:grid-cols-12 gap-2 pb-4 border-b mb-4">
      <div className="col-span-6 self-center">
        <FreeDiceInput
          variant="small"
          numberOfDice={quickButton.amount}
          onNewNumber={(newAmount) =>
            onUpdate({ id: quickButton.id, amount: newAmount })
          }
          maxDiceAmount={maxDiceAmount}
        />
      </div>
      <div className="col-span-4 md:col-start-8 self-center flex items-center space-x-2">
        <Checkbox
          id={`instant-${quickButton.id}`}
          checked={quickButton.type === 'instantRoll'}
          onCheckedChange={(checked) => {
            onUpdate({
              id: quickButton.id,
              type: checked ? 'instantRoll' : 'setAmount',
            })
          }}
        />
        <label
          htmlFor={`instant-${quickButton.id}`}
          className="text-sm cursor-pointer"
        >
          {t('rollInstantly')}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="col-start-7 md:col-start-12 self-center"
        onClick={() => onDelete(quickButton.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

