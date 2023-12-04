'use client'

import { RootState } from '@/app/store'
import { useSelector, useDispatch } from 'react-redux'
import { D6ConfigType, updateConfig as updateConfigAction } from '../d6.slice'
import { useEffect } from 'react'

export const D6_CONFIG_IDENTIFIER = 'd6Config'

export const useD6Config = () => {
  const config = useSelector((state: RootState) => state.d6.config)
  const dispatch = useDispatch()

  const updateConfig = (newConfig: Partial<D6ConfigType>) =>
    dispatch(updateConfigAction(newConfig))

  // Save config in localstorage whenever it updates.
  useEffect(() => {
    // Do not store config while we are still loading.
    if (config.isLoading) return
    console.log('Storing new config in localstorage.', config)
    localStorage.setItem(D6_CONFIG_IDENTIFIER, JSON.stringify(config))
  }, [config])

  // Initially load config from localstorage.
  useEffect(() => {
    if (!config.isLoading) return
    console.log('Loading config from localstorage.')
    const storedConfig = localStorage.getItem(D6_CONFIG_IDENTIFIER)
    console.log('Stored config:', storedConfig)
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig)
      parsedConfig.isLoading = false
      updateConfig(parsedConfig)
    } else {
      updateConfig({ ...config, isLoading: false })
    }
  }, [])

  return { config, updateConfig }
}
