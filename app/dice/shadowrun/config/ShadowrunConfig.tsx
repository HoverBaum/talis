'use client'

import { useConfig } from '../useConfig'
import { Toggle } from './Toggle'

export const ShadowrunConfig = () => {
  const { config, updateConfig } = useConfig()
  return (
    <div>
      <div className="max-w-[40rem] mx-auto">
        <Toggle
          label="New results at bottom"
          checked={config.showNewResultBottom}
          onChange={(checked) => updateConfig({ showNewResultBottom: checked })}
        />

        <Toggle
          label="Free input"
          checked={config.useFreeInput}
          onChange={(checked) => updateConfig({ useFreeInput: checked })}
        />

        <Toggle
          label="Quick buttons"
          checked={config.useQuickButtons}
          onChange={(checked) => updateConfig({ useQuickButtons: checked })}
        />
      </div>
    </div>
  )
}
