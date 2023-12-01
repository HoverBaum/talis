'use client'

import Link from 'next/link'
import { useConfig } from '../useConfig'
import { Toggle } from '../../../../../components/Toggle'
import { QuickButtonConfig } from './QuickButtonConfig'
import { ExtractProperty } from 'utils/extractProperty'
import { DictionaryType } from 'dictionaries/dictionanier'

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
        <div>
          <Toggle
            className="mb-2"
            label={dict.newResultsAtBottom}
            checked={config.showNewResultBottom}
            onChange={(checked) =>
              updateConfig({ showNewResultBottom: checked })
            }
          />

          <Toggle
            className="mb-2"
            label={dict.freeInput}
            checked={config.useFreeInput}
            onChange={(checked) => updateConfig({ useFreeInput: checked })}
          />

          <Toggle
            className="mb-2"
            label={dict.sortDice}
            checked={config.sortDice}
            onChange={(checked) => updateConfig({ sortDice: checked })}
          />

          <Toggle
            className="mb-2"
            label={dict.quickButtons}
            checked={config.useQuickButtons}
            onChange={(checked) => updateConfig({ useQuickButtons: checked })}
          />

          {config.useQuickButtons && (
            <div className="p-6">
              <div>
                {config.quickButtons &&
                  config.quickButtons.map((button) => (
                    <>
                      <QuickButtonConfig key={button.id} quickButton={button} />
                    </>
                  ))}
              </div>
              <button
                className="btn btn-outline btn-sm -mt-8"
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
              </button>
            </div>
          )}
        </div>
      )}

      <Link href="/dice/shadowrun">
        <button className="btn btn-primary w-full mt-8">{dict.back}</button>
      </Link>
    </div>
  )
}
