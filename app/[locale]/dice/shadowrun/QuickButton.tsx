'use client'

import { Button } from '@/components/ui/button'
import { QuickButtonType } from './shadowrun-store'

type QuickButtonProps = {
  quickButton: QuickButtonType
  onClick: () => void
}

export function QuickButton({ quickButton, onClick }: QuickButtonProps) {
  const { id, amount, type } = quickButton
  return (
    <Button
      variant="outline"
      className="relative mx-2"
      key={id}
      onClick={onClick}
    >
      {type === 'instantRoll' && (
        <div className="bg-background rounded-full absolute -top-1 -right-1 p-0.5">
          <span className="text-xs">⚡</span>
        </div>
      )}
      {amount}
    </Button>
  )
}

