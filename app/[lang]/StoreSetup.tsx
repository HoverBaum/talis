'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateConfig } from './dice/shadowrun/shadowrun.slice'

/**
 * Only serves to load the config from localStorage on the client.
 */
export const StoreSetup = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const configString = window.localStorage.getItem('shadowrunConfig')
    if (configString) {
      const clientConfig = JSON.parse(configString)
      clientConfig.isLoading = false
      dispatch(updateConfig(clientConfig))
    } else {
      // We are still done loading now, using default config though.
      dispatch(updateConfig({ isLoading: false }))
    }
  }, [])
  return null
}
