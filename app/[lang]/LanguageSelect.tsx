'use client'

import { Locale } from 'i18n-config'
import { ChangeEvent, useEffect, useState } from 'react'

type LanguageSelectProps = {
  className?: string
}

export const LanguageSelect = ({ className }: LanguageSelectProps) => {
  const [currentLocale, setCurrentLocale] = useState<Locale>('en')
  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value)
    const newLocale = e.target.value
    const pathParts = window.location.pathname.split('/')
    pathParts[1] = newLocale
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
    <div>
      <label className="label pb-0">
        <span className="label-text">Language</span>
      </label>

      <select
        value={currentLocale}
        onChange={onSelect}
        className={`select select-bordered mt-0 w-full max-w-xs ${className}`}
      >
        <option value="en">English</option>
        <option value="de">Deutsch</option>
      </select>
    </div>
  )
}
