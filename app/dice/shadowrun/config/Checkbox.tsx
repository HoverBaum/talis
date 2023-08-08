type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  className?: string
}

export const Checkbox = ({
  checked,
  onChange,
  label,
  className,
}: CheckboxProps) => {
  return (
    <div className={`form-control ${className}`}>
      <label className="flex items-center cursor-pointer">
        <span className="mr-2">{label}</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="checkbox"
        />
      </label>
    </div>
  )
}
