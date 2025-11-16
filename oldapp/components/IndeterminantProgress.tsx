type IndeterminantProgressProps = {
  className?: string
}

export const IndeterminantProgress = ({
  className,
}: IndeterminantProgressProps) => {
  return (
    <div
      className={`bg-base-200 rounded-full h-2 relative overflow-hidden shadow-inner mx-2 ${className}`}
    >
      <div className="bg-primary rounded-full absolute bottom-0 top-0 w-1/2 animate-indeterminate"></div>
    </div>
  )
}
