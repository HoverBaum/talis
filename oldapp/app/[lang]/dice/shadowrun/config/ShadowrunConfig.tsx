'use client'

import Link from 'next/link'
import { useConfig } from '../useConfig'
import { Switch } from '@/components/ui/switch'
import { QuickButtonConfig } from './QuickButtonConfig'
import { ExtractProperty } from 'utils/extractProperty'
import { DictionaryType } from 'dictionaries/dictionanier'
import { Button } from '@/components/ui/button'

export const ShadowrunConfig = ({
  dict,
}: {
  dict: ExtractProperty<DictionaryType, 'Roller.Shadowrun.Config'>
}) => {
  const { config, updateConfig } = useConfig()

  return (
    <div className="max-w-[40rem] mx-auto">
      {config.isLoading && <div>Loading...</div>}
      {!config.isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <label
              htmlFor="new-results-bottom"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {dict.newResultsAtBottom}
            </label>
            <Switch
              id="new-results-bottom"
              checked={config.showNewResultBottom}
              onCheckedChange={(checked) =>
                updateConfig({ showNewResultBottom: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <label
              htmlFor="free-input"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {dict.freeInput}
            </label>
            <Switch
              id="free-input"
              checked={config.useFreeInput}
              onCheckedChange={(checked) => updateConfig({ useFreeInput: checked })}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <label
              htmlFor="sort-dice"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {dict.sortDice}
            </label>
            <Switch
              id="sort-dice"
              checked={config.sortDice}
              onCheckedChange={(checked) => updateConfig({ sortDice: checked })}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <label
              htmlFor="quick-buttons"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {dict.quickButtons}
            </label>
            <Switch
              id="quick-buttons"
              checked={config.useQuickButtons}
              onCheckedChange={(checked) => updateConfig({ useQuickButtons: checked })}
            />
          </div>

          {config.useQuickButtons && (
            <div className="p-6 border rounded-lg">
              <div>
                {config.quickButtons &&
                  config.quickButtons.map((button) => (
                    <QuickButtonConfig key={button.id} quickButton={button} />
                  ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateConfig({
                    quickButtons: [
                      ...config.quickButtons,
                      {
                        id: Math.random().toString(36).substring(5),
                        amount: 8,
                        type: 'setAmount',
                      },
                    ],
                  })
                }
              >
                {dict.addQuickButton}
              </Button>
            </div>
          )}
        </div>
      )}

      <Link href="/dice/shadowrun">
        <Button className="w-full mt-8">{dict.back}</Button>
      </Link>
    </div>
  )
}
