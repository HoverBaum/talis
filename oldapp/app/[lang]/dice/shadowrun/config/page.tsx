import { ShadowrunConfig } from './ShadowrunConfig'
import Link from 'next/link'
import { CloseIcon } from '@/components/icons/CloseIcon'
import { Locale } from 'i18n-config'
import { getDictionary } from 'dictionaries/dictionanier'
import { Button } from '@/components/ui/button'

export default async function ShadowrunConfigPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 border-b">
        <Link href="/dice/shadowrun">
          <Button variant="ghost" size="icon">
            <CloseIcon />
          </Button>
        </Link>
        <h2 className="text-lg font-semibold">Shadowrun Config</h2>
      </div>
      <main className="flex-grow p-2 md:p-4 overflow-auto">
        <ShadowrunConfig dict={dict.Roller.Shadowrun.Config} />
      </main>
    </div>
  )
}
