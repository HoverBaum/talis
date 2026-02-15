'use client'

/**
 * SidebarOptionsPicker
 * - Card-style picker for sidebar display options (full, condensed, none)
 * - Each card shows a preview of how the sidebar footer will look
 * - Uses SelectionCard for consistency with ThemePicker and ModePicker
 */

import { useTranslations } from 'next-intl'
import { SelectionCard } from './SelectionCard'
import { cn } from '@/lib/utils'
import type { SidebarOptions } from '@/app/[locale]/pages/settings/settings-store'

type SidebarOptionsPickerProps = {
  value: SidebarOptions
  onValueChange: (value: SidebarOptions) => void
  className?: string
  groupLabelId?: string
}

const options: SidebarOptions[] = ['full', 'condensed', 'none']

const FullPreview = () => (
  <div className="space-y-2 text-xs">
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground truncate">Language</span>
      <div className="h-5 w-12 rounded border border-border bg-muted/50" />
    </div>
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground truncate">Mode</span>
      <div className="h-5 w-12 rounded border border-border bg-muted/50" />
    </div>
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground truncate">Theme</span>
      <div className="h-5 w-12 rounded border border-border bg-muted/50" />
    </div>
  </div>
)

const CondensedPreview = () => (
  <div className="flex items-center gap-2">
    <div className="h-6 flex-1 min-w-0 rounded border border-border bg-muted/50" />
    <div className="h-6 w-6 shrink-0 rounded border border-border bg-muted/50" />
  </div>
)

const NonePreview = () => (
  <div className="flex items-center justify-center py-1">
    <span className="text-xs text-muted-foreground">—</span>
  </div>
)

export const SidebarOptionsPicker = ({
  value,
  onValueChange,
  className,
  groupLabelId,
}: SidebarOptionsPickerProps) => {
  const t = useTranslations('Settings')

  return (
    <div
      role="radiogroup"
      aria-labelledby={groupLabelId}
      className={cn('grid grid-cols-1 items-stretch gap-3 sm:grid-cols-3', className)}
    >
      {options.map((optionValue) => (
        <SelectionCard
          key={optionValue}
          isSelected={value === optionValue}
          onSelect={() => onValueChange(optionValue)}
          sizeClass="min-h-[88px] p-3"
        >
          <div className="flex h-full flex-col gap-3">
            <div className="flex min-h-[2.75rem] shrink-0 items-start">
              <span className="font-medium">
                {optionValue === 'full'
                  ? t('sidebarOptionsFull')
                  : optionValue === 'condensed'
                    ? t('sidebarOptionsCondensed')
                    : t('sidebarOptionsNone')}
              </span>
            </div>
            <div className="shrink-0 rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 p-2">
              {optionValue === 'full' && <FullPreview />}
              {optionValue === 'condensed' && <CondensedPreview />}
              {optionValue === 'none' && <NonePreview />}
            </div>
          </div>
        </SelectionCard>
      ))}
    </div>
  )
}
