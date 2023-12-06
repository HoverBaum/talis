'use client'

import { Toggle } from '@/components/Toggle'
import { useD6Config } from './useD6Config'
import { ExtractProperty } from 'utils/extractProperty'
import { DictionaryType } from 'dictionaries/dictionanier'
import Link from 'next/link'

type D6ConfigProps = {
  dict: ExtractProperty<DictionaryType, 'Roller.D6.Config'>
}

export const D6Config = ({ dict }: D6ConfigProps) => {
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
        label={dict.newResultsAtBottom}
        checked={config.showNewResultBottom}
        onChange={(checked) => updateConfig({ showNewResultBottom: checked })}
      />
      <Toggle
        className="mb-2"
        label={dict.sortDice}
        checked={config.sortDice}
        onChange={(checked) => updateConfig({ sortDice: checked })}
      />
      <Toggle
        className="mb-2"
        label={dict.sumDice}
        checked={config.sumDice}
        onChange={(checked) => updateConfig({ sumDice: checked })}
      />

      <Link href="/dice/d6">
        <button className="btn btn-primary w-full mt-8">{dict.back}</button>
      </Link>
    </div>
  )
}
