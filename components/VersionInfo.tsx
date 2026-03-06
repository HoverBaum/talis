'use client'

import { useTranslations } from 'next-intl'

const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev'
const AUTHOR_URL = 'https://hendrikwallbaum.de/'
const GITHUB_URL = 'https://github.com/HoverBaum/talis'

interface VersionInfoProps {
  /**
   * When true, always renders two stacked lines.
   * When false (default), renders two lines on mobile and one line on desktop.
   */
  stacked?: boolean
}

export function VersionInfo({ stacked = false }: VersionInfoProps) {
  const tPWA = useTranslations('PWA')
  const tFooter = useTranslations('Footer')

  return (
    <div
      className={`inline-flex text-xs text-muted-foreground flex-row gap-1 ${stacked ? '!flex-col' : ''} `
      }
    >
      <span>
        {tPWA('version')}: {appVersion}
      </span>
      {!stacked && (
        <span className="hidden sm:inline" aria-hidden="true">
          ·
        </span>
      )}
      <span>
        {tFooter('builtBy')}{' '}
        <a
          href={AUTHOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Hendrik
        </a>{' '}
        on{' '}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          GitHub
        </a>
      </span>
    </div>
  )
}
