import { Navbar } from '@/app/Navbar'
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
      <Navbar title="D6 Config" fixed={true}>
        <Link href="/dice/d6">
          <button className="btn btn-square btn-ghost">
            <CloseIcon />
          </button>
        </Link>
      </Navbar>
      <main className="flex-grow basis-0 p-2 md:p-4">
        <h1>D6 Config</h1>
      </main>
    </div>
  )
}
