'use client'

import { Switch } from '@/components/ui/switch'
import { useD6Config } from './useD6Config'
import { ExtractProperty } from 'utils/extractProperty'
import { DictionaryType } from 'dictionaries/dictionanier'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type D6ConfigProps = {
  dict: ExtractProperty<DictionaryType, 'Roller.D6.Config'>
}

export const D6Config = ({ dict }: D6ConfigProps) => {
  const { config, updateConfig } = useD6Config()

  // Return nothing while config is loading from local storage.
  // This takes so short that a progress indicator is confusing!
  if (config.isLoading) return ''

  return (
    // FadeIn to hide the loading state.
    <div className="animate-fadeIn space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <label
          htmlFor="new-results-bottom-d6"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {dict.newResultsAtBottom}
        </label>
        <Switch
          id="new-results-bottom-d6"
          checked={config.showNewResultBottom}
          onCheckedChange={(checked) => updateConfig({ showNewResultBottom: checked })}
        />
      </div>
      
      <div className="flex items-center justify-between space-x-2">
        <label
          htmlFor="sort-dice-d6"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {dict.sortDice}
        </label>
        <Switch
          id="sort-dice-d6"
          checked={config.sortDice}
          onCheckedChange={(checked) => updateConfig({ sortDice: checked })}
        />
      </div>
      
      <div className="flex items-center justify-between space-x-2">
        <label
          htmlFor="sum-dice"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {dict.sumDice}
        </label>
        <Switch
          id="sum-dice"
          checked={config.sumDice}
          onCheckedChange={(checked) => updateConfig({ sumDice: checked })}
        />
      </div>

      <Link href="/dice/d6">
        <Button className="w-full mt-8">{dict.back}</Button>
      </Link>
    </div>
  )
}
