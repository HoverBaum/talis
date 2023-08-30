'use client'

import React, { createContext } from 'react'
import { DictionaryType } from './dictionanier'

interface TranslationContextType {
  dictionary: Partial<DictionaryType>
}

export const TranslationContext = createContext<TranslationContextType>({
  dictionary: {},
})

interface TranslationProviderProps {
  children: React.ReactNode
  dictionary: DictionaryType
}

export const TranslationProvider = ({
  children,
  dictionary,
}: TranslationProviderProps) => {
  return (
    <TranslationContext.Provider value={{ dictionary }}>
      {children}
    </TranslationContext.Provider>
  )
}
