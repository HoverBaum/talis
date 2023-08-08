'use client'

import Link from 'next/link'
import { useConfig } from '../useConfig'
import { Toggle } from './Toggle'
import { QuickButtonConfig } from './QuickButtonConfig'

export const ShadowrunConfig = () => {
  const { config, updateConfig } = useConfig()

  return (
    <div className="max-w-[40rem] mx-auto">
      {config.isLoading && <div>Loading...</div>}
      {!config.isLoading && (
        <div>
          <Toggle
            className="mb-2"
            label="New results at bottom"
            checked={config.showNewResultBottom}
            onChange={(checked) =>
              updateConfig({ showNewResultBottom: checked })
            }
          />

          <Toggle
            className="mb-2"
            label="Free input"
            checked={config.useFreeInput}
            onChange={(checked) => updateConfig({ useFreeInput: checked })}
          />

          <Toggle
            className="mb-2"
            label="Sort dice"
            checked={config.sortDice}
            onChange={(checked) => updateConfig({ sortDice: checked })}
          />

          <Toggle
            className="mb-2"
            label="Quick buttons"
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
                Add Quick Button
              </button>
            </div>
          )}
        </div>
      )}

      <Link href="/dice/shadowrun">
        <button className="btn w-full mt-8">Back</button>
      </Link>
    </div>
  )
}
