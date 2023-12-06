import { Navbar } from '@/components/Navbar'
import { ShadowrunConfig } from './ShadowrunConfig'
import Link from 'next/link'
import { CloseIcon } from '@/components/icons/CloseIcon'
import { Locale } from 'i18n-config'
import { getDictionary } from 'dictionaries/dictionanier'

export default async function ShadowrunConfigPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Shadowrun Config" fixed={true}>
        <Link href="/dice/shadowrun">
          <button className="btn btn-square btn-ghost">
            <CloseIcon />
          </button>
        </Link>
      </Navbar>
      <main className="flex-grow basis-0 p-2 md:p-4">
        <ShadowrunConfig dict={dict.Roller.Shadowrun.Config} />
      </main>
    </div>
  )
}
