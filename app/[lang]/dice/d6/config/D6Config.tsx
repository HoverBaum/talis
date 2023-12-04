'use client'

import { Toggle } from '@/components/Toggle'
import { useD6Config } from './useD6Config'

export const D6Config = () => {
  const { config, updateConfig } = useD6Config()
  console.log(config)

  // Return nothing while config is loading from local storage.
  // This takes so short that a progress indicator is confusing!
  if (config.isLoading) return ''

  return (
    // FadeIn to hide the loading state.
    <div className="animate-fadeIn">
      <Toggle
        className="mb-2"
        label="New results bottom"
        checked={config.showNewResultBottom}
        onChange={(checked) => updateConfig({ showNewResultBottom: checked })}
      />
      <Toggle
        className="mb-2"
        label="Sort Dice"
        checked={config.sortDice}
        onChange={(checked) => updateConfig({ sortDice: checked })}
      />
    </div>
  )
}
