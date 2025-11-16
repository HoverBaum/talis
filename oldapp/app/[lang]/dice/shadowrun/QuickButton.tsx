import { Emoji } from '@/components/icons/Emoji'
import { QuickButtonType } from './shadowrun.slice'
import { Button } from '@/components/ui/button'

type QuickButtonProps = {
  quickButton: QuickButtonType
  onClick: () => void
}

export const QuickButton = ({ quickButton, onClick }: QuickButtonProps) => {
  const { id, amount, type } = quickButton
  return (
    <Button
      variant="outline"
      size="icon"
      className="mx-2 relative"
      key={id}
      onClick={onClick}
    >
      {type === 'instantRoll' && (
        <div className="bg-background rounded-full absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
          <Emoji className="!text-foreground">⚡</Emoji>
        </div>
      )}
      {amount}
    </Button>
  )
}
