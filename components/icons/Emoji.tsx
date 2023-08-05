type EmojiProps = {
  children: React.ReactNode
  className?: string
}

export const Emoji = ({ children, className }: EmojiProps) => {
  return <span className={`font-emoji ${className || ''}`}>{children}</span>
}
