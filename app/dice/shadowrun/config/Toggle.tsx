type ToggleProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const Toggle = ({ label, checked, onChange }: ToggleProps) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input
          type="checkbox"
          className="toggle"
          checked={checked}
          onChange={() => onChange(!checked)}
        />
      </label>
    </div>
  )
}
