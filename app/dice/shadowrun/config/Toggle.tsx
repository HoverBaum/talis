type ToggleProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  disabled?: boolean
}

export const Toggle = ({
  label,
  checked,
  onChange,
  disabled,
  className,
}: ToggleProps) => {
  return (
    <div className={`form-control ${className}`}>
      <label className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input
          type="checkbox"
          disabled={disabled}
          className="toggle"
          checked={checked}
          onChange={() => onChange(!checked)}
        />
      </label>
    </div>
  )
}
