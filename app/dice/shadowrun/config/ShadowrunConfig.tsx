'use client'

import Link from 'next/link'
import { useConfig } from '../useConfig'
import { Toggle } from './Toggle'

export const ShadowrunConfig = () => {
  const { config, updateConfig } = useConfig()
  return (
    <div className="max-w-[40rem] mx-auto">
      <div>
        <Toggle
          className="mb-2"
          label="New results at bottom"
          checked={config.showNewResultBottom}
          onChange={(checked) => updateConfig({ showNewResultBottom: checked })}
        />

        <Toggle
          className="mb-2"
          label="Free input"
          checked={config.useFreeInput}
          onChange={(checked) => updateConfig({ useFreeInput: checked })}
        />

        <Toggle
          className="mb-2"
          label="Quick buttons"
          checked={config.useQuickButtons}
          onChange={(checked) => updateConfig({ useQuickButtons: checked })}
        />
      </div>

      <Link href="/dice/shadowrun">
        <button className="btn w-full mt-8">Back</button>
      </Link>
    </div>
  )
}
