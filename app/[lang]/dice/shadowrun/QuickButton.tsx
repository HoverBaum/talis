import { Emoji } from '@/components/icons/Emoji'
import { QuickButtonType } from './shadowrun.slice'

type QuickButtonProps = {
  quickButton: QuickButtonType
  onClick: () => void
}

export const QuickButton = ({ quickButton, onClick }: QuickButtonProps) => {
  const { id, amount, type } = quickButton
  return (
    <button
      className="btn btn-square btn-outline mx-2 relative"
      key={id}
      onClick={onClick}
    >
      {type === 'instantRoll' && (
        <div className="bg-base-100 rounded-full absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
          <Emoji className="!text-base-content">⚡</Emoji>
        </div>
      )}
      {amount}
    </button>
  )
}
