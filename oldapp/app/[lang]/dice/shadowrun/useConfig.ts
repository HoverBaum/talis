'use client'

import { RootState } from '@/app/store'
import { useSelector, useDispatch } from 'react-redux'
import {
  ShadowrunConfigType,
  updateConfig as updateConfigAction,
} from './shadowrun.slice'

export const useConfig = () => {
  const config = useSelector((state: RootState) => state.shadowrun.config)
  const dispatch = useDispatch()

  const updateConfig = (newConfig: Partial<ShadowrunConfigType>) =>
    dispatch(updateConfigAction(newConfig))

  return { config, updateConfig }
}
