'use client'

/**
 * ClearCacheButton Component
 *
 * Provides a button that clears all roller store cache from localStorage.
 *
 * Purpose:
 * - Allows users to fix broken rollers by clearing corrupted cache data
 * - Only clears roller store data, preserving theme and mode preferences
 * - Uses shadcn/ui Dialog for confirmation before clearing
 * - Clears all localStorage keys with STORAGE_PREFIX from utils/store-utils (all persisted roller stores use this prefix)
 *
 * Behavior:
 * - Shows a confirmation dialog before clearing cache
 * - Clears all roller storage keys (those starting with STORAGE_PREFIX) from localStorage
 * - Preserves theme (`talis-theme`) and mode (`talis-mode`) settings
 * - Reloads the page after clearing to ensure stores reset properly
 * - Uses i18n translations for all user-facing text
 *
 * Usage:
 * - Place in MDX content (e.g., about page)
 * - Any roller using createStoreMiddleware with persistConfig uses STORAGE_PREFIX and is included when clearing
 *
 * Constraints:
 * - Must be a client component (uses localStorage and browser APIs)
 * - Requires shadcn/ui Dialog component
 * - Requires i18n translations in 'About' namespace
 */
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { STORAGE_PREFIX } from '@/utils/store-utils'

export const ClearCacheButton = () => {
  const [open, setOpen] = useState(false)
  const t = useTranslations('About')

  const handleClearCache = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })

    // Close dialog and reload page
    setOpen(false)
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t('clearCacheButton')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('clearCacheDialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('clearCacheDialogDescription')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('clearCacheCancel')}
          </Button>
          <Button variant="destructive" onClick={handleClearCache}>
            {t('clearCacheConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
