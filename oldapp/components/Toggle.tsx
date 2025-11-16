import { Switch } from '@/components/ui/switch'

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
    <div className={`flex items-center justify-between space-x-2 ${className || ''}`}>
      <label
        htmlFor={label}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <Switch
        id={label}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  )
}
