'use client'

import { useTranslations } from 'next-intl'
import { QuickButtonType } from '@/stores/shadowrun-store'
import { FreeDiceInput } from '../FreeDiceInput'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useShadowrunStore } from '@/stores/shadowrun-store'
import { Separator } from '@/components/ui/separator'

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
    <div className="py-4 border-b last:border-b-0">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <FreeDiceInput
            variant="small"
            numberOfDice={quickButton.amount}
            onNewNumber={(newAmount) =>
              onUpdate({ id: quickButton.id, amount: newAmount })
            }
            maxDiceAmount={maxDiceAmount}
          />
        </div>

        <Separator orientation="vertical" className="hidden md:block h-8" />

        <div className="flex items-center justify-between md:justify-end gap-4">
          <div className="flex items-center space-x-2">
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
              className="text-sm cursor-pointer font-medium"
            >
              {t('rollInstantly')}
            </label>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-destructive hover:text-destructive"
            onClick={() => onDelete(quickButton.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

