import { useContext } from 'react'
import { TranslationContext } from './TranslationContext'
import { DictionaryType } from './dictionanier'
import { ExtractProperty } from 'utils/extractProperty'

export const useDict = <P extends string | string[]>(
  path: P
): ExtractProperty<DictionaryType, P> => {
  const { dictionary } = useContext(TranslationContext)

  // Utility to recursively get nested properties
  const getNestedProperty = (obj: any, keys: string[]): any => {
    if (!keys.length) return obj
    if (!obj || !obj.hasOwnProperty(keys[0])) return null
    return getNestedProperty(obj[keys[0]], keys.slice(1))
  }

  let keys: string[]
  if (typeof path === 'string') {
    keys = path.split('.')
  } else {
    keys = path
  }

  const result = getNestedProperty(dictionary, keys)

  // You might need to cast the result if TypeScript cannot infer the exact type
  return result as ExtractProperty<DictionaryType, P>
}
