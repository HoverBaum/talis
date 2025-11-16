'use client'

import { Locale } from 'i18n-config'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type LanguageSelectProps = {
  className?: string
}

export const LanguageSelect = ({ className }: LanguageSelectProps) => {
  const [currentLocale, setCurrentLocale] = useState<Locale>('en')
  
  const onSelect = (value: string) => {
    const pathParts = window.location.pathname.split('/')
    pathParts[1] = value
    const newPath = pathParts.join('/')
    window.location.pathname = newPath
  }

  useEffect(() => {
    const currentLocale =
      typeof window !== 'undefined'
        ? window.location.pathname.split('/')[1]
        : 'en'
    setCurrentLocale(currentLocale as Locale)
  }, [])

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">
        Language
      </label>
      <Select value={currentLocale} onValueChange={onSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="de">Deutsch</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
