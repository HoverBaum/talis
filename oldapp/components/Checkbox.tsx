import { Checkbox as CheckboxUI } from '@/components/ui/checkbox'

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
    <div className={`flex items-center space-x-2 ${className || ''}`}>
      <CheckboxUI
        id={label}
        checked={checked}
        onCheckedChange={onChange}
      />
      {label && (
        <label
          htmlFor={label}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  )
}
