'use client'

import { useTheme } from '@/components/theme-provider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ThemeSelectProps = {
  className?: string
  withLabel?: boolean
}

export const ThemeSelect = ({
  className,
  withLabel = false,
}: ThemeSelectProps) => {
  const { theme, setTheme } = useTheme()

  return (
    <div className={className}>
      {withLabel && (
        <label className="block text-sm font-medium mb-2">
          Color Theme
        </label>
      )}
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="talisTheme">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="shadowrun">Shadowrun</SelectItem>
          <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
          <SelectItem value="synthwave">Synthwave</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
