'use client'

import { useCallback, useEffect, useState } from 'react'

const DEFAULT_CONFIG = {
  showNewResultBottom: true,
  useFreeInput: false,
  sortDice: false,
  useQuickButtons: true,
}

type ConfigType = typeof DEFAULT_CONFIG

export const useConfig = () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG)

  // Initially load config from local storage.
  useEffect(() => {
    const configFromStorage = window.localStorage.getItem('shadowrunConfig')
    console.log('Config loaded from Storage', configFromStorage)
    if (configFromStorage) {
      setConfig(JSON.parse(configFromStorage))
    }
  }, [])

  const updateConfig = useCallback(
    (configUpdate: Partial<ConfigType>) => {
      const newConfig: ConfigType = { ...config, ...configUpdate }
      setConfig(newConfig)
      console.log('newConfig', newConfig)
      localStorage.setItem('shadowrunConfig', JSON.stringify(newConfig))
    },
    [config, setConfig]
  )

  return { config, updateConfig }
}
